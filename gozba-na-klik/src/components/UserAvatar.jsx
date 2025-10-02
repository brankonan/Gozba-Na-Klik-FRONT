import React from "react";
import { API_ORIGIN } from "../api/axios";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function UserAvatar({ size = 36, srcOverride = null }) {
  const user = getUser();
  const raw = user?.profilePicture ?? user?.ProfilePicture; // pokriva oba naziva
  const base = raw
    ? raw.startsWith("http")
      ? raw
      : `${API_ORIGIN}${raw}`
    : null;

  const src = srcOverride ?? base;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "#eee",
      }}
    >
      {src ? (
        <img
          src={src}
          alt="me"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span
          style={{
            display: "grid",
            placeItems: "center",
            height: "100%",
            color: "#777",
            fontSize: 12,
          }}
        >
          no
        </span>
      )}
    </div>
  );
}
