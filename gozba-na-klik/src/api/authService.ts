import { NavigateFunction } from "react-router-dom";
import api from "./axios";
import axios from "axios";


export const loginAsync = async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
        email: email,
        password: password
    });

    return response.data;
}

export const logoutAsync = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
}

export const handleLogout = async (navigate: NavigateFunction) => {
    try {
        await logoutAsync();
    }
    catch (error) {
        alert("Doslo je do neocekivane greske!");
        console.error(error);
    }
    finally {
        localStorage.removeItem("user");
        navigate("/login");
    }
}

export const handleLogin = async (navigate: NavigateFunction, data: any) => {
    try {
        const { email, password } = data;
        const user = await loginAsync(email, password);
        localStorage.setItem("user", JSON.stringify(user))

        switch (user.role) {
            case "Admin":
                navigate("/admin");
                break;

            case "Courier":
                navigate("/courier/schedule");
                break;

            case "Employee":
                navigate("/employee/orders");
                break;

            case "RestaurantOwner":
                navigate("/owner")
                break;

            case "Customer":
                navigate(`/profile/${user.Id}`);
                break;

            default:
                navigate("/");
        }
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
                alert("Username or password is incorrect");
            }
            else {
                alert("Unexpected error occurred");
            }
        }
    }
}