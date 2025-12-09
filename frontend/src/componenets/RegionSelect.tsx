import type { SelectProps } from "antd";
import { Select, Spin } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "../hooks";
import { useLazyGetAllRegionsQuery } from "../redux";
import type { AllCountryRequest } from "../types";

/**
 * RegionSelect: loads regions for a given countryId.
 * Props:
 * - countryId: number | null — when null, no load (disabled)
 * - value/onChange similar to CountrySelect
 *
 * This is intentionally lightweight: it requests the first page on open or when
 * countryId/search changes. It supports server-side search via showSearch + onSearch.
 */

type Option = { label: string; value: number; meta?: any };

type RegionSelectProps = Omit<SelectProps<number>, "options" | "onSearch"> & {
  countryId: number | null;
  placeholder?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  pageSize?: number;
  preload?: boolean;
};

const DEFAULT_PAGE_SIZE = 100;

export function RegionSelect({
  countryId,
  placeholder = "Select a region",
  value,
  onChange,
  pageSize = DEFAULT_PAGE_SIZE,
  ...rest
}: RegionSelectProps) {
  const [trigger, lastResult] = useLazyGetAllRegionsQuery();
  const { data, isFetching } = lastResult;
  const [options, setOptions] = useState<Option[]>([]);
  const [searchText, setSearchText] = useState("");
  const { value: debouncedSearch, cancel: cancelDebounce } = useDebouncedValue(
    searchText,
    { delay: 300 }
  );

  // load when countryId / search changes
  const load = useCallback(
    (country: number | null) => {
      if (!country) {
        setOptions([]);
        return;
      }
      trigger({
        country,
        limit: pageSize,
        offset: 0,
        search: debouncedSearch || undefined,
      } as unknown as AllCountryRequest);
    },
    [trigger, pageSize, debouncedSearch]
  );

  useEffect(() => {
    load(countryId);
  }, [countryId, load]);

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
      disabled={!countryId}
      placeholder={countryId ? placeholder : "Select country first"}
      filterOption={false}
      onSearch={handleSearch}
      onOpenChange={(open) => {
        if (open && (!options || options.length === 0) && countryId) {
          load(countryId);
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

export default RegionSelect;
