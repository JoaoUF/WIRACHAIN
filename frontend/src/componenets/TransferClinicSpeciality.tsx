import type { TransferProps } from "antd";
import { Card, Empty, Grid, Spin, Transfer, Typography } from "antd";
import type { UUID } from "crypto";
import { useEffect, useMemo, useState } from "react";
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

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface TransferClinicSpecialityProps {
  idClinic: UUID | string;
}

export function TransferClinicSpeciality({
  idClinic,
}: TransferClinicSpecialityProps) {
  const screens = useBreakpoint();

  // fetch all specialities (left data)
  const allReq: AllSpecialityRequest = { limit: 1000, offset: 0 };
  const { data: allSpecData, isFetching: allFetching } =
    useGetAllSpecialitiesQuery(allReq);

  // fetch clinic specialities (right data)
  const clinicReq: AllClinicSpecialityRequest = {
    limit: 1000,
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

  // Prepare the left data source (specialities)
  const dataSource = useMemo(() => {
    return (allSpecData?.results || []).map((s: SpecialityBasic) => ({
      key: String(s.id),
      title: s.name,
      description: s.description || "",
    }));
  }, [allSpecData]);

  // Map specialityId -> clinicSpecialityId for deletion purpose
  const specialityIdToClinicSpecialityId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const cs of clinicSpecData?.results || []) {
      if (cs?.speciality?.id) {
        map[String(cs.speciality.id)] = String(cs.id);
      }
    }
    return map;
  }, [clinicSpecData]);

  // derive initial target keys (speciality ids assigned to clinic)
  const initialTargetKeys = useMemo(() => {
    return (clinicSpecData?.results || []).map((cs: ClinicSpecialityBasic) =>
      String(cs.speciality.id)
    );
  }, [clinicSpecData]);

  // local target keys for optimistic UI
  const [targetKeys, setTargetKeys] = useState<string[]>(initialTargetKeys);

  // keep targetKeys in sync when clinicSpecData changes (server update)
  useEffect(() => {
    setTargetKeys(initialTargetKeys);
  }, [initialTargetKeys]);

  const loading =
    allFetching ||
    clinicSpecLoading ||
    addBulkState.isLoading ||
    deleteBulkState.isLoading;

  // responsive list widths
  const listWidth = screens.md ? 360 : screens.sm ? 300 : 280;
  const listHeight = 320;

  const leftCount = (allSpecData?.results || []).length;
  const rightCount = (clinicSpecData?.results || []).length;

  const handleChange: TransferProps["onChange"] = async (
    nextTargetKeys,
    direction,
    moveKeys
  ) => {
    // optimistic update
    setTargetKeys(nextTargetKeys as string[]);

    try {
      if (direction === "right") {
        // moveKeys are speciality ids (strings)
        const toAdd = (moveKeys || []).map((k) => k as unknown as UUID);
        // POST payload shape depends on your backend. many APIs expect { clinic: id, ids: [] }
        await addBulk({ clinic: idClinic as UUID, ids: toAdd } as any).unwrap();
      } else {
        // deletion: map speciality ids to clinicSpeciality ids
        const toDeleteClinicSpecIds = (moveKeys || [])
          .map((k) => specialityIdToClinicSpecialityId[String(k)])
          .filter(Boolean) as UUID[];
        if (toDeleteClinicSpecIds.length > 0) {
          await deleteBulk(toDeleteClinicSpecIds).unwrap();
        }
      }
    } catch (err) {
      console.log(err);
      // revert optimistic update on error
      setTargetKeys(initialTargetKeys);
    } finally {
      // refresh server state
      void refetchClinicSpecs();
    }
  };

  // render empty state if no specialities available
  const leftEmpty = !allFetching && dataSource.length === 0;
  const rightEmpty =
    !clinicSpecLoading && (clinicSpecData?.results || []).length === 0;

  return (
    <Card>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexDirection: screens.md ? "row" : "column",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: screens.md ? "0 0 auto" : "1 1 auto" }}>
          <Text strong>Available specialities ({leftCount})</Text>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
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
            titles={[`Available (${leftCount})`, `Assigned (${rightCount})`]}
            rowKey={(item) => item.key}
            listStyle={{
              width: listWidth,
              height: listHeight,
            }}
            locale={{
              itemUnit: "item",
              itemsUnit: "items",
            }}
          />

          {(leftEmpty || rightEmpty) && (
            <div style={{ marginTop: 12 }}>
              {leftEmpty && <Empty description="No available specialities" />}
              {rightEmpty && !leftEmpty && (
                <div style={{ color: "#777", marginTop: 8 }}>
                  No assigned specialities
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
