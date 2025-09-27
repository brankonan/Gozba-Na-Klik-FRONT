import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAsync } from "../api/authService"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
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
            if (error.response && error.response.status === 401) {
                alert(error.response.data);
            }
            else {
                alert("Unexpected error occured")
            }
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>LOGIN</h2>

            <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
            />

            <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
            />

            <button type="submit" onSubmit={handleSubmit}>Login</button>
            <button type="button" onClick={() => navigate("/")}>Back</button>
        </form>
    );
}

export default Login;