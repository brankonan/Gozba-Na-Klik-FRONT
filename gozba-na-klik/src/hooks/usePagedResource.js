import { useEffect, useState } from "react";


export function usePagedResource(fetchFunction, options = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialSortBy = "name",
    initialSortDir = "asc",
    initialFilter = {},
  } = options;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDir, setSortDir] = useState(initialSortDir);
  const [filter, setFilter] = useState(initialFilter);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFunction({
          page,
          pageSize,
          sortBy,
          sortDir,
          filter,
        });

        if (cancelled) return;

        setItems(result.items || []);
        setTotalCount(result.totalCount || 0);
      } catch (e) {
        if (cancelled) return;
        console.error("Greska pri ucitavanju:", e);
        setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, sortBy, sortDir, filter, fetchFunction]);

  const toggleFilters = () => setFiltersOpen((prev) => !prev);
  const closeFilters = () => setFiltersOpen(false);
  const closeSort = () => setSortOpen(false);

  return {
    items,
    loading,
    error,
    page,
    pageSize,
    sortBy,
    sortDir,
    filter,
    totalCount,
    setPage,
    setPageSize,
    setSortBy,
    setSortDir,
    setFilter,
    filtersOpen,
    sortOpen,
    toggleFilters,
    closeFilters,
    closeSort,
  };
}
