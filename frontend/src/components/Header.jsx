import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="brand"><span>PX</span> PasalX</Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          {user && <NavLink to="/orders">My Orders</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          <Link className="cart-link" to="/cart">Cart <b>{count}</b></Link>
          {user ? (
            <button className="ghost-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <Link className="outline-btn" to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}