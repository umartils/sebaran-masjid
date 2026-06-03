import { useState } from "react";

interface UseTableFiltersOption<TCategory extends string> {
    defaultCategory?: TCategory;
}

export function useTableFilters<TCategory extends string=string>({
    defaultCategory= "" as TCategory,
}: UseTableFiltersOption<TCategory> = {}){
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<TCategory>(defaultCategory);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    function resetFilters() {
        setQuery("");
        setCategoryFilter(defaultCategory);
        setStartDate("");
        setEndDate("");
    }

    return {
        query, setQuery, categoryFilter, setCategoryFilter, startDate, setStartDate, endDate, setEndDate, resetFilters
    };
}