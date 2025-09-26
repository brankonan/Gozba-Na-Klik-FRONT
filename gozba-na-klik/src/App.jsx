import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Admin from "./pages/admin/Admin";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin/>} />
      <Route path="/admin/users" element={<AdminUsers/>} />
    </Routes>
  );
}

export default App;
