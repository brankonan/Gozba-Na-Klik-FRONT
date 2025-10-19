import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export default function CourierLayout() {
    return (
        <div className="layout layout-courier">

            <Navbar />

            <main>
                <Outlet />
            </main>

            <Footer />

        </div>
    )
}