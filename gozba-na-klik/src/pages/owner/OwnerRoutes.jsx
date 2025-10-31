import React from "react";
import { Routes, Route } from "react-router-dom";
import RestaurantMenu from "./RestaurantMenu";
import RestaurantsLoader from "./RestaurantsLoader";
import OwnerLayout from "../../layouts/OwnerLayout";
import EditProfile from "../../components/forms/EditProfile";

export default function OwnerRoutes() {
  return (
    <Routes>
      <Route element={<OwnerLayout />}>
        <Route path="restaurant/:id/menu" element={<RestaurantMenu />} />
        <Route path="profile/:id" element={<EditProfile />}></Route>
        <Route path="restaurants" index element={<RestaurantsLoader />} />
      </Route>
    </Routes>
  );
}
