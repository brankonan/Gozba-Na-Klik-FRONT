import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import PublicRoutes from "./pages/public/PublicRoutes";
import AdminRoutes from "./pages/admin/AdminRoutes";
import CustomerRoutes from "./pages/customer/CustomerRoutes";
import CourierRoutes from "./pages/courier/CourierRoutes";

import EmployeeLayout from "./layouts/EmployeeLayout";
import EmployeeOrdersPage from "./pages/employee/EmployeeOrdersPage";
import EditProfile from "./components/forms/EditProfile/EditProfile";

import OwnerLayout from "./layouts/OwnerLayout";
import OwnerRestaurants from "./pages/owner/OwnerRestaurants";
import OwnerAllOrdersPage from "./components/forms/ownerEdit/OwnerAllOrdersPage";
import RestaurantMenuLoaderOwner from "./pages/owner/RestaurantMenuLoaderOwner";

import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";

import OwnerEmployees from "./pages/owner/OwnerEmployees";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        {/* Public AZ*/}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Ostale rute AZ*/}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/customer/*" element={<CustomerRoutes />} />
        <Route path="/courier/*" element={<CourierRoutes />} />

        {/* Customer orders AZ*/}
        <Route path="/orders" element={<CustomerOrdersPage />} />

        {/* Employee grana AZ*/}
        <Route path="/employee" element={<EmployeeLayout />}>
          {/* /employee ili /employee/ AZ*/}
          <Route index element={<EmployeeOrdersPage />} />
          {/* /employee/orders AZ*/}
          <Route path="orders" element={<EmployeeOrdersPage />} />
          {/* /employee/profile/:id AZ*/}
          <Route path="profile/:id" element={<EditProfile />} />
          {/* sve ostalo pod /employee vodi na /employee/orders AZ*/}
          <Route path="*" element={<Navigate to="orders" replace />} />
        </Route>

        {/* Owner gramna AZ */}
        <Route path="/owner" element={<OwnerLayout />}>
          {/* /owner/restaurants AZ*/}
          <Route path="restaurants" element={<OwnerRestaurants />} />
          <Route path="employees" element={<OwnerEmployees />} />{" "}
          {/* /owner/orders – porudzbine za vlasnikove restorane AZ*/}
          <Route path="orders" element={<OwnerAllOrdersPage />} />
          {/* /owner/restaurant/:id/menu AZ*/}
          <Route
            path="restaurant/:id/menu"
            element={<RestaurantMenuLoaderOwner />}
          />
          {/* /owner/profile/:id AZ*/}
          <Route path="profile/:id" element={<EditProfile />} />
          {/* fallback za owner-a AZ*/}
          <Route path="*" element={<Navigate to="restaurants" replace />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
