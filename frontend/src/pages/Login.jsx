import React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await login(email, password);
      navigate(u?.role === "admin" ? "/admin" : location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to continue shopping."
      onSubmit={submit}
      error={error}
      busy={busy}
      fields={
        <>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </>
      }
      footer={
        <>
          New to PasalX? <Link to="/signup">Create an account</Link>
        </>
      }
    />
  );
}
function AuthForm({ title, subtitle, onSubmit, error, busy, fields, footer }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">PX</div>
        <p className="eyebrow">PASALX</p>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit}>
          {fields}
          <button className="primary-btn full" disabled={busy}>
            {busy ? "Please wait…" : "Continue"}
          </button>
        </form>
        <p className="auth-footer">{footer}</p>
      </div>
    </section>
  );
}
