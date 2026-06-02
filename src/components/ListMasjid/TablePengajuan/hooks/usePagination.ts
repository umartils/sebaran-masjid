import { useMemo, useState } from "react";

export function usePagination(filtered: any[]) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filtered.slice(startIndex, endIndex);
  }, [filtered, page, pageSize]);

  return {
    page,
    pageSize,
    totalPages,
    paginatedData,
    setPage,
    setPageSize,
  };
}
