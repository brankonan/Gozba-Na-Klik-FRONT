import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CourierLayout from "../../layouts/CourierLayout";
import EditProfile from "../../components/forms/EditProfile";
import CourierSchedule from "../../components/forms/CourierSchedule";

export default function CourierRoutes() {
  return (
    <Routes>
      <Route element={<CourierLayout />}>
        <Route index element={<CourierSchedule />} />
        <Route path="schedule" element={<CourierSchedule />} />
        <Route path="schedule/:id" element={<CourierSchedule />} />
        <Route path="profile/:id" element={<EditProfile />} />
        {/* fallback da NIKAD ne bude prazan ekran  AZ */}
        <Route path="*" element={<Navigate to="schedule" replace />} />
      </Route>
    </Routes>
  );
}
