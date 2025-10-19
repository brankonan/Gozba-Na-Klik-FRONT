import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import EditProfile from "../../components/forms/EditProfile";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="profile/:id" element={<EditProfile />}></Route>
      </Route>
    </Routes>
  )
}