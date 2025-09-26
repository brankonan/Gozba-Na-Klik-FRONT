import api from "./axios";

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