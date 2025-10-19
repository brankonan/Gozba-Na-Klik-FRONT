import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export default function CustomerLayout() {
    return (
        <div className="layout layout-customer">

            <Navbar />

            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}