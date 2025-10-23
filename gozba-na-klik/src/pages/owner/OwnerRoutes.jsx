import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RestaurantMenuLoader from "./RestaurantMenuLoader";
import RestaurantsLoader from "./RestaurantsLoader";
import OwnerLayout from "../../layouts/OwnerLayout";
import EditProfile from "../../components/forms/EditProfile";

export default function OwnerRoutes() {
  return (
    <Routes>
      <Route path="/owner" element={<OwnerLayout />}>
        <Route path="restaurant/:id/menu" element={<RestaurantMenuLoader />} />
        <Route path="profile/:id" element={<EditProfile />} />
        <Route path="restaurants" element={<RestaurantsLoader />} />
      </Route>
    </Routes>
  );
}
