import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAsync } from "../api/authService";
import { useForm } from "react-hook-form";

const Login = () => {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleLogin = async (data) => {
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
            if (error.response && error.response.status === 401) {
                alert(error.response.data);
            }
            else {
                alert("Unexpected error occured")
            }
        }

    }

    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            <h2>LOGIN</h2>

            <input
                {...register("email", { required: "Obavezno polje" })}
                placeholder="Email"
                type="email"
            />
            {errors.email && <p>{errors.email.message}</p>}

            <input
                {...register("password", { required: "Obavezno polje" })}
                placeholder="Password"
                type="password"
            />
            {errors.password && <p>{errors.password.message}</p>}

            <button type="submit">Login</button>
            <button type="button" onClick={() => navigate("/")}>Back</button>
        </form>
    );
}

export default Login;