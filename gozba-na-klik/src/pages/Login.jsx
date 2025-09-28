import React from "react";
import "../styles/index.scss";

// import { useForm } from "react-hook-form";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";

// export default function Login() {
//   const navigate = useNavigate();
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
//     defaultValues: { username: "", password: "" },
//   });

//   const onSubmit = async (data) => {
//     try {
//       const res = await api.post("/auth/login", data); // očekuje token
//       const token = res?.data?.token;
//       if (!token) {
//         alert("Prijava neuspešna (token nedostaje).");
//         return;
//       }
//       localStorage.setItem("auth_token", token);
//       navigate("/");
//     } catch {
//       alert("Pogrešan username ili lozinka.");
//     }
//   };
//     // P r o m e n i t i     s t i l
//   return (
//     <div style={{ maxWidth: 440, margin: "60px auto" }}>
//       <h2>Prijava</h2>
//       <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
//         <label>
//           Username
//           <input {...register("username", { required: "Obavezno polje" })} />
//           {errors.username && <small style={{ color: "crimson" }}>{errors.username.message}</small>}
//         </label>

//         <label>
//           Password
//           <input type="password" {...register("password", { required: "Obavezno polje" })} />
//           {errors.password && <small style={{ color: "crimson" }}>{errors.password.message}</small>}
//         </label>

//         <button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Prijavljivanje..." : "Prijava"}
//         </button>
//       </form>
//                         {/*Bilo bi dobro i da ovo dugme lici na nesto  */}
//       <p style={{ marginTop: 12 }}>
//         Nemaš nalog? <Link to="/register">Registracija</Link>
//       </p>

//       <p style={{ marginTop: 8 }}>
//         Vrati se na pocetak
//         <button style={{ marginLeft: 8 }} onClick={() => navigate("/")}>Pocetak</button>
//       </p>
//     </div>
//   );
// }

const Login = () => {};

export default Login;
