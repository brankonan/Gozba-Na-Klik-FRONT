import React from "react";
import { getRestaurantsPaged } from "../../api/customerRestaurantService";
import RestaurantsGrid from "../../components/Restaurants/RestaurantsGrid";
import { RestaurantCarousel } from "../../components/Restaurants/TopCategoryRestaurantCarousel";
import { usePagedResource } from "../../hooks/usePagedResource";
import Pagination from "../../components/shared/Pagination";
import SortBar from "../../components/shared/SortBar";
import RestaurantFilters from "../../components/Restaurants/RestaurantFilters";

const CustomerRestaurants = () => {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const {
    items: restaurants,
    loading,
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
  } = usePagedResource(getRestaurantsPaged);

  const sortOptions = [
    { value: "name", label: "Naziv" },
    { value: "capacity", label: "Kapacitet" },
  ];

  if (!user) {
    return <div style={{ padding: 40 }}>Niste prijavljeni.</div>;
  }

  return (
    <div className="customer-container">
      <main className="section-container">
        <RestaurantCarousel />

        <div className="toolbar-row">
          <SortBar
            sortBy={sortBy}
            sortDir={sortDir}
            options={sortOptions}
            onChange={({ sortBy, sortDir }) => {
              setSortBy(sortBy);
              setSortDir(sortDir);
              setPage(1);
            }}
          />

          <RestaurantFilters
            filter={filter}
            onChange={(newFilter) => {
              setFilter(newFilter);
              setPage(1);
            }}
          />
        </div>

        {loading ? (
          <p className="loading-state">Ucitavanje...</p>
        ) : (
          <RestaurantsGrid restaurants={restaurants} />
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </main>
    </div>
  );
};

export default CustomerRestaurants;