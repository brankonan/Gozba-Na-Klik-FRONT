import React, { useEffect, useState } from "react";
import {
  getMostRecentRestaurants,
  getFavouriteRestaurants,
  getTopRatedRestaurants,
} from "../../api/customerRestaurantService";
import "../../styles/carousel.scss";
import RestaurantCarouselCard from "./RestaurantCarouselCard";
import "../../styles/Restaurant.scss";

const categories = [
  { key: "mostRecent", label: "Poslednji" },
  { key: "favourites", label: "Omiljeni" },
  { key: "topRated", label: "Najbolje ocenjeni" },
];

export function RestaurantCarousel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState({
    mostRecent: [],
    favourites: [],
    topRated: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const userId = JSON.parse(localStorage.getItem("user")).id;

        const [mostRecent, favourites, topRated] = await Promise.all([
          getMostRecentRestaurants(userId),
          getFavouriteRestaurants(userId),
          getTopRatedRestaurants(),
        ]);

        setData({
          mostRecent,
          favourites,
          topRated,
        });
      } catch (err) {
        console.error(err);
        setError("Doslo je do greske pri ucitavanju restorana.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
  };

  const currentCategory = categories[currentIndex];
  const restaurants = data[currentCategory.key];

  return (
    <div className="restaurant-carousel">
      <div className="restaurant-carousel__header">
        <h2>{currentCategory.label}</h2>

        <div className="restaurant-carousel__controls">
          <button
            type="button"
            className="btn-carousel btn-prev"
            onClick={handlePrev}
          >
            &lt;
          </button>

          <button
            type="button"
            className="btn-carousel btn-next"
            onClick={handleNext}
          >
            &gt;
          </button>
        </div>
      </div>

      {loading && (
        <div className="restaurant-carousel__status">Ucitavanje...</div>
      )}

      {error && !loading && (
        <div className="restaurant-carousel__status restaurant-carousel__status--error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="restaurant-carousel__list">
          {restaurants.map((r) => (
            <RestaurantCarouselCard key={r.id} restaurant={r} />
          ))}

          {restaurants.length === 0 && (
            <div className="restaurant-carousel__empty">
              Nema restorana za ovu kategoriju.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// import React from "react";

// const TopCategoryRestaurants = ({ category }) => {
//     const [restaurants, setRestaurants] = useState([]);

//     useEffect(() => {
//         const fetchRestaurants = async () => {
//             let data;

//             try {
//                 switch (category) {
//                     case "recent":
//                         data = await getMostRecentRestaurants();
//                         break;
//                     case "favourite":
//                         data = await getFavouriteRestaurants();
//                         break;
//                     case "top-rated":
//                         data = await getTopRatedRestaurants();
//                         break;
//                     default:
//                         data = [];
//                 }
//                 setRestaurants(data);
//             }
//             catch (err) {
//                 alert("Greska pri ucitavanju restorana.");
//             }
//         }

//         fetchRestaurants();
//     }, [category]);

//     return (
//         <div className="top-category-restaurant-container">
//             <h1>
//                 {category === "top-rated" && "Najbolje ocenjeni"}
//                 {category === "favourite" && "Omiljeni"}
//                 {category === "recent" && "Nedavni"}
//             </h1>

//             <div className="top-category-restaurant-card-container">
//                 {restaurants.map((r) => {
//                     <div key={r.id} className="top-category-restaurant-card">
//                         <img src={r.imageUrl} alt={r.name} />
//                         <h2 className="restaurant-name-overlay">{r.name}</h2>
//                     </div>
//                 })}
//             </div>
//         </div>
//     );
// }

// export default TopCategoryRestaurants;
