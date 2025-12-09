import type { SelectProps } from "antd";
import { Select, Spin } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "../hooks";
import { useLazyGetAllCitiesQuery } from "../redux";
import type { AllCountryRequest } from "../types";

/**
 * CitySelect: loads cities for a given countryId and regionId.
 * Similar to RegionSelect but requires regionId (and countryId) to load.
 */

type Option = { label: string; value: number; meta?: any };

type CitySelectProps = Omit<SelectProps<number>, "options" | "onSearch"> & {
  countryId: number | null;
  regionId: number | null;
  placeholder?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  pageSize?: number;
  preload?: boolean;
};

const DEFAULT_PAGE_SIZE = 200;

export function CitySelect({
  countryId,
  regionId,
  placeholder = "Select a city",
  value,
  onChange,
  pageSize = DEFAULT_PAGE_SIZE,
  ...rest
}: CitySelectProps) {
  const [trigger, lastResult] = useLazyGetAllCitiesQuery();
  const { data, isFetching } = lastResult;
  const [options, setOptions] = useState<Option[]>([]);
  const [searchText, setSearchText] = useState("");
  const { value: debouncedSearch, cancel: cancelDebounce } = useDebouncedValue(
    searchText,
    { delay: 300 }
  );

  const load = useCallback(
    (country: number | null, region: number | null) => {
      if (!country || !region) {
        setOptions([]);
        return;
      }
      trigger({
        country,
        region,
        limit: pageSize,
        offset: 0,
        search: debouncedSearch || undefined,
      } as unknown as AllCountryRequest);
    },
    [trigger, pageSize, debouncedSearch]
  );

  useEffect(() => {
    load(countryId, regionId);
  }, [countryId, regionId, load]);

  useEffect(() => {
    if (!data) return;
    const incoming = (data.results || []).map((r: any) => ({
      label: r.name,
      value: r.id,
      meta: r,
    }));
    setOptions(incoming);
  }, [data]);

  useEffect(() => {
    return () => {
      cancelDebounce();
    };
  }, [cancelDebounce]);

  const handleSearch = (v: string) => {
    setSearchText(v);
  };

  const handleChange = (v: number | undefined) => {
    onChange?.(v ?? null);
  };

  const selectOptions = useMemo(
    () => options.map((o) => ({ label: o.label, value: o.value })),
    [options]
  );

  return (
    <Select<number>
      showSearch
      disabled={!regionId}
      placeholder={regionId ? placeholder : "Select region first"}
      filterOption={false}
      onSearch={handleSearch}
      onOpenChange={(open) => {
        if (
          open &&
          (!options || options.length === 0) &&
          countryId &&
          regionId
        ) {
          load(countryId, regionId);
        }
      }}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
      options={selectOptions}
      value={value ?? undefined}
      onChange={(v) => handleChange(v as number | undefined)}
      {...rest}
    />
  );
}

export default CitySelect;
