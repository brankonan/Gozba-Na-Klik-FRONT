import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { getAllUsers, createUser } from "../../api/adminService";
import {
  getCourierStatus,
  suspendCourier,
  unsuspendCourier,
} from "../../api/courierService";

import "../../styles/index.scss";
import UserAvatar from "../../components/shared/UserAvatar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [statusById, setStatusById] = useState({});
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "Courier",
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getAllUsers();
      setUsers(data);
      await fetchStatuses(data);
    } catch (err) {
      console.error("Error occurred while loading users: ", err);
    }
  }

  async function fetchStatuses(list) {
    try {
      const couriers = (list || users).filter((u) => u.role === "Courier");
      const pairs = await Promise.all(
        couriers.map(async (u) => {
          try {
            const s = await getCourierStatus(u.id);
            return [u.id, s?.status || "-"];
          } catch {
            return [u.id, "-"];
          }
        })
      );
      setStatusById((prev) => ({ ...prev, ...Object.fromEntries(pairs) }));
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleSuspend(u) {
    if (u.role !== "Courier") return;
    setBusyId(u.id);
    try {
      if (statusById[u.id] === "Suspended") {
        await unsuspendCourier(u.id);
      } else {
        await suspendCourier(u.id);
      }
      const s = await getCourierStatus(u.id);
      setStatusById((prev) => ({ ...prev, [u.id]: s?.status || "-" }));
    } catch (err) {
      console.error(err);
      alert("Failed to change status.");
    } finally {
      setBusyId(null);
    }
  }

  const onSubmit = async (data) => {
    try {
      await createUser(data);
      await fetchUsers();
      reset();
      setShowForm(false);
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Error creating user.");
    }
  };

  return (
    <div>
      <header className="navbar">
        <div className="navbar-inner">
          <div style={{ fontWeight: 800 }}>Users·Management</div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? "Close form" : "Add new user"}
          </button>
          <UserAvatar />
        </div>
      </header>

      <main className="section container">
        {showForm && (
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <h2 style={{ margin: 0, marginBottom: 8 }}>New User</h2>
            <form
              className="stack"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label className="label">First name</label>
                <input
                  className="input"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  type="text"
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName.message}</span>
                )}

                <label className="label">Last name</label>
                <input
                  className="input"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName.message}</span>
                )}

                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <span className="error">{errors.email.message}</span>
                )}

                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 chars",
                    },
                  })}
                  placeholder="********"
                />
                {errors.password && (
                  <span className="error">{errors.password.message}</span>
                )}

                <label className="label">Role</label>
                <select className="input" {...register("role")}>
                  <option value="Courier">Courier</option>
                  <option value="RestaurantOwner">RestaurantOwner</option>
                </select>
                <div className="help">Dodeli osnovnu ulogu</div>
              </div>

              <div className="row">
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <section className="stack">
          <h2>Users</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>E-mail</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge badge-role">{u.role}</span>
                    </td>
                    <td>
                      {u.role === "Courier" ? (
                        <span className="badge">{statusById[u.id] || "-"}</span>
                      ) : (
                        <span className="help" style={{ opacity: 0.8 }}>
                          -
                        </span>
                      )}
                    </td>
                    <td>
                      {u.role === "Courier" ? (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => toggleSuspend(u)}
                          disabled={busyId === u.id}
                          title={
                            statusById[u.id] === "Suspended"
                              ? "Unsuspend"
                              : "Suspend"
                          }
                        >
                          {busyId === u.id
                            ? "..."
                            : statusById[u.id] === "Suspended"
                            ? "Unsuspend"
                            : "Suspend"}
                        </button>
                      ) : (
                        <span className="help" style={{ opacity: 0.8 }}>
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <button className="btn btn-primary btn-sm" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}
