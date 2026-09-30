import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || user?.username || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const shippingFee = subtotal >= 5000 ? 0 : 100;
  const total = subtotal + shippingFee;
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/order", {
        items: items.map((x) => ({
          product: x.product._id,
          quantity: x.quantity,
        })),
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      navigate(`/orders/${data.order?._id || data._id}`, {
        replace: true,
        state: { placed: true },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  }
  if (!items.length)
    return (
      <section className="section">
        <div className="container empty">
          <h2>Your cart is empty</h2>
          <Link className="primary-btn" to="/products">
            Shop products
          </Link>
        </div>
      </section>
    );
  return (
    <section className="section">
      <div className="container">
        <Link className="back-link" to="/cart">
          ← Back to cart
        </Link>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={submit}>
            <p className="eyebrow">CHECKOUT</p>
            <h1>Shipping details</h1>
            {error && <div className="error">{error}</div>}
            <label>
              Full name
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </label>
            <label>
              Phone number
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label>
              Address
              <textarea
                required
                rows="3"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
            <div className="form-grid">
              <label>
                City
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </label>
              <label>
                Postal code
                <input
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              Payment method
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="MOCK">Mock Payment</option>
              </select>
            </label>
            <button className="primary-btn full" disabled={loading}>
              {loading ? "Placing order…" : "Place order"}
            </button>
          </form>
          <aside className="summary">
            <h2>Order summary</h2>
            {items.map((x) => (
              <div className="mini-line" key={x.product._id}>
                <span>
                  {x.product.productName} × {x.quantity}
                </span>
                <strong>
                  Rs.{" "}
                  {(
                    Number(x.product.productPrice) * x.quantity
                  ).toLocaleString()}
                </strong>
              </div>
            ))}
            <hr />
            <div className="mini-line">
              <span>Subtotal</span>
              <strong>Rs. {subtotal.toLocaleString()}</strong>
            </div>
            <div className="mini-line">
              <span>Shipping</span>
              <strong>{shippingFee ? `Rs. ${shippingFee}` : "Free"}</strong>
            </div>
            <div className="total">
              <span>Total</span>
              <strong>Rs. {total.toLocaleString()}</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
