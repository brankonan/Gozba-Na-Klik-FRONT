import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import EditProfile from "../../components/forms/EditProfile/EditProfile";
import CustomerLayout from "../../layouts/CustomerLayout";
import CustomerRestaurants from "./CustomerRestaurants";
import RestaurantMenuLoaderCustomer from "../customer/RestaurantMenuLoaderCustomer";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="profile/:id" element={<EditProfile />}></Route>
        <Route path="restaurants" element={<CustomerRestaurants />}></ Route>
        <Route path="restaurant/:id/menu" element={<RestaurantMenuLoaderCustomer />} />
      </Route>
    </Routes>
  )
}