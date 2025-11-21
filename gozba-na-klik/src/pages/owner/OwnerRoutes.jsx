import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RestaurantMenuLoaderOwner from "./RestaurantMenuLoaderOwner";
import OwnerLayout from "../../layouts/OwnerLayout";
import EditProfile from "../../components/forms/EditProfile/EditProfile";
import OwnerRestaurants from "./OwnerRestaurants";

export default function OwnerRoutes() {
    return (
        <Routes>
            <Route element={<OwnerLayout />}>
                <Route path="restaurant/:id/menu" element={<RestaurantMenuLoaderOwner />} />
                <Route path="profile/:id" element={<EditProfile />}></Route>
                <Route path="restaurants" index element={<OwnerRestaurants />} />
            </Route>
        </Routes>
    );
}
