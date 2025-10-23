import React from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import EditProfile from "../../components/forms/EditProfile";

export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route path="profile/:id" element={<EditProfile />} />
      </Route>
    </Routes>
  );
}
