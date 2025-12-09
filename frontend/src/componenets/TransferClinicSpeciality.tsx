import type { TransferProps } from "antd";
import { Card, Spin, Transfer } from "antd";
import type { UUID } from "crypto";
import { useMemo } from "react";
import {
  useAddBulkClinicSpecialitiesMutation,
  useDeleteBulkClinicSpecialitiesMutation,
  useGetAllClinicSpecialitiesQuery,
  useGetAllSpecialitiesQuery,
} from "../redux";
import type { AllSpecialityRequest, SpecialityBasic } from "../types";
import type {
  AllClinicSpecialityRequest,
  ClinicSpecialityBasic,
} from "../types/ClinicSpeciality";

/**
 * TransferClinicSpeciality
 *
 * Left side: all specialities (SpecialityBasic)
 * Right side: specialities assigned to this clinic (ClinicSpecialityBasic)
 *
 * Behavior:
 * - dataSource: list of all specialities { key: id, title: name }
 * - targetKeys: speciality ids that are present in clinicSpecialities
 * - onChange: when moving right -> call addBulk with speciality ids to add
 *             when moving left  -> call deleteBulk with clinicSpeciality ids mapped from the speciality ids being removed
 *
 * Note: endpoints and shapes are inferred from your types. If your addBulk endpoint
 * expects a different payload (e.g., objects with clinic id), adjust the payload.
 */

interface TransferClinicSpecialityProps {
  idClinic: UUID | string;
}

export function TransferClinicSpeciality({
  idClinic,
}: TransferClinicSpecialityProps) {
  // left: all specialities (we fetch a large page; if you have many specialities,
  // you can replace with an infinite/load-more implementation).
  const specialitiesRequest: AllSpecialityRequest = { limit: 100, offset: 0 };
  const { data: allSpecData, isFetching: specialitiesLoading } =
    useGetAllSpecialitiesQuery(specialitiesRequest);

  // right: clinic specialities mapping
  const clinicReq: AllClinicSpecialityRequest = {
    limit: 100,
    offset: 0,
    clinic: idClinic as unknown as UUID,
  };
  const {
    data: clinicSpecData,
    isFetching: clinicSpecLoading,
    refetch: refetchClinicSpecs,
  } = useGetAllClinicSpecialitiesQuery(clinicReq);

  const [addBulk, addBulkState] = useAddBulkClinicSpecialitiesMutation();
  const [deleteBulk, deleteBulkState] =
    useDeleteBulkClinicSpecialitiesMutation();

  // prepare dataSource for Transfer
  const dataSource = useMemo(() => {
    const items = (allSpecData?.results || []).map((s: SpecialityBasic) => ({
      key: String(s.id),
      title: s.name,
      description: s.description,
    }));
    return items;
  }, [allSpecData]);

  // prepare mapping specialityId -> clinicSpecialityId for deletions
  const specialityIdToClinicSpecialityId: Record<string, string> =
    useMemo(() => {
      const map: Record<string, string> = {};
      for (const cs of clinicSpecData?.results || []) {
        // cs.speciality.id -> cs.id (clinicSpeciality id)
        if (cs && cs.speciality && cs.speciality.id) {
          map[String(cs.speciality.id)] = String(cs.id);
        }
      }
      return map;
    }, [clinicSpecData]);

  // targetKeys as speciality ids present in clinicSpeciality list
  const targetKeys = useMemo(() => {
    return (clinicSpecData?.results || []).map((cs: ClinicSpecialityBasic) =>
      String(cs.speciality.id)
    );
  }, [clinicSpecData]);

  const loading =
    specialitiesLoading ||
    clinicSpecLoading ||
    addBulkState.isLoading ||
    deleteBulkState.isLoading;

  const handleChange: TransferProps["onChange"] = async (
    __nextTargetKeys,
    direction,
    moveKeys
  ) => {
    // nextTargetKeys: final list of speciality ids assigned to clinic (strings)
    // moveKeys: keys moved in this operation (strings)
    try {
      if (direction === "right") {
        // adding specialities: send speciality ids (UUIDs) to addBulk
        const toAdd = moveKeys.map((k) => k as unknown as UUID);
        await addBulk(toAdd).unwrap();
      } else {
        // removing specialities: map speciality ids to clinicSpeciality ids
        const toDeleteClinicSpecIds = (moveKeys || [])
          .map((k) => specialityIdToClinicSpecialityId[String(k)])
          .filter(Boolean) as UUID[];
        if (toDeleteClinicSpecIds.length > 0) {
          await deleteBulk(toDeleteClinicSpecIds).unwrap();
        }
      }
    } catch (err) {
      // ignore here or surface an error UI as needed
      // after mutation, refetch clinic specialities to refresh right list
      console.log(err);
    } finally {
      void refetchClinicSpecs();
    }
  };

  return (
    <Card>
      <div style={{ minHeight: 160 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin />
          </div>
        ) : null}

        <Transfer
          dataSource={dataSource}
          targetKeys={targetKeys}
          onChange={handleChange}
          render={(item) => item.title}
          oneWay={false}
          showSearch
          titles={["Available specialities", "Assigned specialities"]}
          rowKey={(item) => item.key}
          listStyle={{
            width: 300,
            height: 320,
          }}
        />
      </div>
    </Card>
  );
}

export default TransferClinicSpeciality;
