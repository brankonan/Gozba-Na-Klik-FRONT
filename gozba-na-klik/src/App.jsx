import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/shared/Navbar";
import PublicRoutes from "./pages/public/PublicRoutes";
import OwnerRoutes from "./pages/owner/OwnerRoutes";
import AdminRoutes from "./pages/admin/AdminRoutes";
import CustomerRoutes from "./pages/customer/CustomerRoutes";
import EmployeeRoutes from "./pages/employee/EmployeeRoutes";
import CourierRoutes from "./pages/courier/CourierRoutes";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/owner/*" element={<OwnerRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/customer/*" element={<CustomerRoutes />} />
        <Route path="/employee/*" element={<EmployeeRoutes />} />
        <Route path="/courier/*" element={<CourierRoutes />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
