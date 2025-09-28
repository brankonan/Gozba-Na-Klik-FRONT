import React from "react";
import "../styles/index.scss";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleLogin } from "../api/authService";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit((formData) => handleLogin(navigate, formData))}
    >
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
      <button type="button" onClick={() => navigate("/")}>
        Back
      </button>
    </form>
  );
};

export default Login;
