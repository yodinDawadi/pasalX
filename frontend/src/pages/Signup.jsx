import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signup(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">PX</div>
        <p className="eyebrow">PASALX</p>
        <h1>Create account</h1>
        <p className="muted">Join PasalX and start shopping.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <label>
            Username
            <input
              name="username"
              required
              value={form.username}
              onChange={change}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={change}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              minLength="6"
              required
              value={form.password}
              onChange={change}
            />
          </label>
          <button className="primary-btn full" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
