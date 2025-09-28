import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Admin from "./pages/Admin";
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
      <Route path="/courier/schedule" element={<Courier />} />
      <Route path="/employee/orders" element={<Employee />} />
      <Route path="/owner" element={<Owner />} />
      <Route path="/profile/:id" element={<Customer />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/users" element={<AdminUsers />} />
    </Routes>
  );
}

export default App;
