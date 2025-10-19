import React from "react";
import { Routes, Route } from "react-router-dom";
import CourierLayout from "../../layouts/CourierLayout";
import EditProfile from "../../components/forms/EditProfile";

export default function CourierRoutes() {
    return (
        <Routes>
            <Route element={<CourierLayout />}>
                <Route path=""></Route>
                <Route path="profile/:id" element={<EditProfile />}></Route>
            </Route>
        </Routes>
    )
}