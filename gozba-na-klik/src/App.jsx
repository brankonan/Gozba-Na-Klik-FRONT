import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Admin from "./pages/admin/Admin";
import AdminUsers from "./pages/admin/AdminUsers";
import Employee from "./pages/Employee";
import Owner from "./pages/Owner";
import Customer from "./pages/Customer";
import Courier from "./pages/Courier";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="admin/:id" element={<Admin />} />
      <Route path="profile/:id" element={<Customer />} />
      <Route path="courier/:id" element={<Courier />} />
      <Route path="owner/:id" element={<Owner />} />
      <Route path="employee/:id" element={<Employee />} />
    </Routes>
  );
}

export default App;
