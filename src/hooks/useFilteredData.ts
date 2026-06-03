import { useMemo } from "react";

interface UseFilteredDataOptions<TItem, TCategory extends string = string> {
  data: TItem[];
  query: string;
  categoryFilter: TCategory;
  startDate: string;
  endDate: string;
  // Fungsi filter kustom per halaman — dipanggil per item
  filterFn: (item: TItem, filters: {
    query: string;
    categoryFilter: TCategory;
    startDate: string;
    endDate: string;
  }) => boolean;
}

export function useFilteredData<TItem, TCategory extends string = string>({
  data,
  query,
  categoryFilter,
  startDate,
  endDate,
  filterFn,
}: UseFilteredDataOptions<TItem, TCategory>) {
  const filtered = useMemo(() => {
    return data.filter((item) =>
      filterFn(item, { query, categoryFilter, startDate, endDate })
    );
  }, [data, query, categoryFilter, startDate, endDate, filterFn]);

  return filtered;
}