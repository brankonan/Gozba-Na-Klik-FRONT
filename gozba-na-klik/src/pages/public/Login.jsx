import React from "react";
import "../../styles/index.scss";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleLogin } from "../../api/authService";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    handleLogin(navigate, formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", { required: "Email je obavezan" })}
        placeholder="Email"
        type="email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        {...register("password", { required: "Lozinka je obavezna" })}
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
