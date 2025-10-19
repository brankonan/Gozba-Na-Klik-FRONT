import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
// import Admin from "./Admin";
import AdminRestaurants from "./AdminRestaurants";
import AdminUsers from "./AdminUsers";
import EditProfile from "../../components/forms/EditProfile";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="restaurants" element={<AdminRestaurants />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="profile/:id" element={<EditProfile />}></Route>
            </Route>
        </Routes>
    );
}