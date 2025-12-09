import type { SelectProps } from "antd";
import { Select, Spin } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback, useDebouncedValue } from "../hooks";
import { useLazyGetAllCountriesQuery } from "../redux";
import type { AllCountryRequest, BaseCountry } from "../types";

type Option = {
  label: string;
  value: number;
  meta?: BaseCountry;
};

type CountrySelectProps = Omit<SelectProps<number>, "options" | "onSearch"> & {
  pageSize?: number;
  placeholder?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  // when true, the component will trigger the first load immediately on mount
  preload?: boolean;
};

const DEFAULT_PAGE_SIZE = 25;
const SCROLL_THRESHOLD_PX = 50;

export function CountrySelect({
  pageSize = DEFAULT_PAGE_SIZE,
  placeholder = "Select a country",
  value,
  onChange,
  preload = false,
  ...rest
}: CountrySelectProps) {
  // lazy trigger + last result
  const [trigger, lastResult] = useLazyGetAllCountriesQuery();
  const { data, isFetching } = lastResult;

  // accumulated options + total
  const [options, setOptions] = useState<Option[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  // pagination tracking
  const offsetRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const requestedOffsetsRef = useRef(new Set<number>());

  // search state and debounced search value
  const [searchText, setSearchText] = useState("");
  const { value: debouncedSearch, cancel: cancelDebouncedSearch } =
    useDebouncedValue(searchText, {
      delay: 300,
    });

  // optional: ensure first page loads when dropdown opens.
  const initialLoadRef = useRef(false);

  // helper: request a page (by offset)
  const requestPage = useCallback(
    (offset: number) => {
      // avoid duplicate requests
      if (requestedOffsetsRef.current.has(offset)) return;
      requestedOffsetsRef.current.add(offset);
      loadingMoreRef.current = true;

      trigger({
        limit: pageSize,
        offset,
        search: debouncedSearch || undefined,
      } as AllCountryRequest)
        // the lazy trigger returns a promise, but we handle merging via the data effect
        .finally(() => {
          loadingMoreRef.current = false;
        });
    },
    [pageSize, trigger, debouncedSearch]
  );

  // effect: when debouncedSearch changes, reset and load first page
  useEffect(() => {
    // reset accumulators
    setOptions([]);
    setTotal(null);
    offsetRef.current = 0;
    requestedOffsetsRef.current.clear();

    // request first page (requestPage will mark the offset)
    requestPage(0);
  }, [debouncedSearch, requestPage]);

  // optional preload on mount
  useEffect(() => {
    if (preload && !initialLoadRef.current) {
      initialLoadRef.current = true;
      // same reset logic
      setOptions([]);
      setTotal(null);
      offsetRef.current = 0;
      requestedOffsetsRef.current.clear();
      requestPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preload]);

  // merge incoming data into options
  useEffect(() => {
    if (!data) return;

    const incoming = data.results.map((c) => ({
      label: c.name,
      value: c.id,
      meta: c,
    }));

    setOptions((prev) => {
      const existingIds = new Set(prev.map((p) => p.value));
      const merged = [...prev];
      for (const item of incoming) {
        if (!existingIds.has(item.value)) merged.push(item);
      }
      return merged;
    });

    setTotal(data.count ?? null);
    // advance offsetRef by number of incoming items
    offsetRef.current += incoming.length;
    loadingMoreRef.current = false;
  }, [data]);

  // load more helper (requests next offset)
  const loadMore = useCallback(() => {
    if (loadingMoreRef.current) return;
    if (total !== null && options.length >= total) return; // no more
    const nextOffset = offsetRef.current;
    requestPage(nextOffset);
  }, [options.length, total, requestPage]);

  // popup scroll handler — detect near-bottom and load more
  const handlePopupScroll: SelectProps<unknown>["onPopupScroll"] = (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const { scrollTop, clientHeight, scrollHeight } = target;
    if (scrollHeight - (scrollTop + clientHeight) < SCROLL_THRESHOLD_PX) {
      loadMore();
    }
  };

  // debounced onSearch callback (so typing in the Select's search field is debounced)
  const { callback: debouncedOnSearch, cancel: cancelSearchCallback } =
    useDebouncedCallback((val: string) => setSearchText(val), 300);

  useEffect(() => {
    return () => {
      cancelDebouncedSearch();
      cancelSearchCallback();
    };
  }, [cancelDebouncedSearch, cancelSearchCallback]);

  const dropdownRender = (menu: React.ReactNode) => (
    <div>
      {menu}
      <div style={{ textAlign: "center", padding: 8 }}>
        {(isFetching || loadingMoreRef.current) && <Spin size="small" />}
      </div>
    </div>
  );

  const selectOptions = options.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  // open handler: trigger initial load when dropdown opens (if nothing loaded yet)
  const handleDropdownVisibleChange = (open: boolean) => {
    if (open && options.length === 0 && !requestedOffsetsRef.current.has(0)) {
      requestPage(0);
    }
    // preserve any onDropdownVisibleChange passed in props
    if (typeof rest.onOpenChange === "function") {
      rest.onOpenChange(open);
    }
  };

  const handleChange = (val: number | null) => {
    if (onChange) onChange(val ?? null);
  };

  return (
    <Select<number>
      showSearch
      placeholder={placeholder}
      filterOption={false} // server-side search
      onSearch={(v) => debouncedOnSearch(v)}
      onPopupScroll={handlePopupScroll}
      popupRender={dropdownRender}
      options={selectOptions}
      notFoundContent={
        isFetching && options.length === 0 ? <Spin size="small" /> : null
      }
      value={value ?? undefined}
      onChange={handleChange}
      onOpenChange={handleDropdownVisibleChange}
      {...rest}
    />
  );
}

export default CountrySelect;
