"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function register() {
    setLoading(true);
    setError("");
    try {
      await apiFetch("/v1/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      alert("Registered successfully. You can now login.");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function login() {
  const res = await apiFetch("/v1/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    alert("Login failed");
    return;
  }

  const json = await res.json();

  // 🔥 STORE TOKEN
  localStorage.setItem("auth_token", json.token);

  router.push("/dashboard");
}




  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          width: 360,
          padding: 24,
          borderRadius: 8,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>
          Auth Demo
        </h2>

        <label>Email</label>
        <input
          style={inputStyle}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          style={inputStyle}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "red", marginTop: 8 }}>{error}</p>
        )}

        <button
          style={{ ...buttonStyle, marginTop: 16 }}
          disabled={loading}
          onClick={login}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          style={{
            ...buttonStyle,
            background: "#eee",
            color: "#333",
            marginTop: 8,
          }}
          disabled={loading}
          onClick={register}
        >
          Register
        </button>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: 4,
  marginBottom: 12,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
};
