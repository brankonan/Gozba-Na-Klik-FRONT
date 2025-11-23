import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import EditProfile from "../../components/forms/EditProfile/EditProfile";
import EmployeeOrdersPage from "./EmployeeOrdersPage";

export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route path="profile/:id" element={<EditProfile />} />
        <Route path="*" element={<Navigate to="orders" replace />} />
      </Route>
    </Routes>
  );
}
