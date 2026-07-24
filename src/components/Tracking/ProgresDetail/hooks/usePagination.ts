import { useState, useEffect } from "react";

// interface usePaginationProps {
//     filtered: any[];
// }

export function usePagination(filtered: any[]) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [paginatedData, setPaginatedData] = useState(filtered.slice(0, pageSize));

    useEffect(() => {
        const total = Math.ceil(filtered.length / pageSize);
        setTotalPages(total);
        setPaginatedData(filtered.slice(0, pageSize));
    }, [filtered, pageSize]);

    return { page, pageSize, totalPages, paginatedData, setPage, setPageSize };
}