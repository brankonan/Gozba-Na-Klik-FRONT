import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import Welcome from "./Welcome";
import Login from "./Login";
import Register from "./Register";

export default function PublicRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<Welcome />} />

                <Route path ="login" element={<Login />} />
                <Route path ="register" element={<Register />} />
            </Route>
        </Routes>
    )
}