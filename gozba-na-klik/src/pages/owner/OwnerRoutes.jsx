import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RestaurantMenuLoader from "./RestaurantMenuLoader";
import RestaurantsLoader from "./RestaurantsLoader";
import OwnerLayout from "../../layouts/OwnerLayout";
import EditProfile from "../../components/forms/EditProfile";

export default function OwnerRoutes() {
    return (
        <Routes>
            <Route element={<OwnerLayout />}>
                <Route path="retaurant/:id/menu" element={<RestaurantMenuLoader />} />
                <Route path="profile/:id" element={<EditProfile />}></Route>
                <Route path="restaurants" index element={<RestaurantsLoader />} />
            </Route>
        </Routes>
    );
}