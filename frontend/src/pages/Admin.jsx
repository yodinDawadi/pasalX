import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import OrderTimeline from "../components/OrderTimeline";
const empty = {
  productName: "",
  productDescription: "",
  productPrice: "",
  stock: "",
  category: "",
  productImage: null,
};
const categories = [
  "electronics",
  "clothing",
  "shoes",
  "grocery",
  "beauty",
  "sports",
  "accessories",
  "home",
];
const statuses = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  async function loadProducts() {
    const r = await api.get("/product");
    setProducts(Array.isArray(r.data) ? r.data : r.data.products || []);
  }
  async function loadOrders() {
    setOrderLoading(true);
    try {
      const r = await api.get("/order");
      setOrders(Array.isArray(r.data) ? r.data : r.data.orders || []);
    } catch (e) {
      setMsg(e.response?.data?.message || "Could not load orders");
    } finally {
      setOrderLoading(false);
    }
  }
  useEffect(() => {
    loadProducts().catch((e) =>
      setMsg(e.response?.data?.message || "Could not load products"),
    );
    loadOrders();
  }, []);
  function change(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  }
  async function submit(e) {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    [
      "productName",
      "productDescription",
      "productPrice",
      "stock",
      "category",
    ].forEach((k) => fd.append(k, form[k]));
    if (form.productImage) fd.append("productImage", form.productImage);
    try {
      if (editing)
        await api.put(`/product/${editing}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      else
        await api.post("/product", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      setForm(empty);
      setEditing(null);
      setMsg(editing ? "Product updated." : "Product added.");
      await loadProducts();
    } catch (err) {
      setMsg(err.response?.data?.message || "Request failed");
    }
  }
  async function del(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/product/${id}`);
      await loadProducts();
    } catch (e) {
      setMsg(e.response?.data?.message || "Delete failed");
    }
  }
  function edit(p) {
    setEditing(p._id);
    setForm({ ...p, productImage: null, category: p.category || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function updateStatus(id, orderStatus) {
  try {
    await api.patch(`/order/${id}/status`, {
      orderStatus,
    });

    setOrders((orders) =>
      orders.map((order) =>
        order._id === id
          ? { ...order, orderStatus }
          : order
      )
    );

    setMsg("Order status updated.");
  } catch (error) {
    setMsg(
      error.response?.data?.message ||
      "Could not update order"
    );
  }
}
  return (
    <section className="section">
      <div className="container admin-page">
        <div className="section-head">
          <div>
            <p className="eyebrow">ADMIN</p>
            <h1>Management</h1>
            <p className="muted">Manage products and customer orders.</p>
          </div>
        </div>
        {msg && <div className="notice">{msg}</div>}
        <div className="admin-tabs">
          <button
            className={tab === "products" ? "active" : ""}
            onClick={() => setTab("products")}
          >
            Products
          </button>
          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => {
              setTab("orders");
              loadOrders();
            }}
          >
            Orders ({orders.length})
          </button>
        </div>
        {tab === "products" ? (
          <>
            <form className="admin-form" onSubmit={submit}>
              <h2>{editing ? "Edit product" : "Add product"}</h2>
              <div className="form-grid">
                <label>
                  Product name
                  <input
                    name="productName"
                    required
                    value={form.productName || ""}
                    onChange={change}
                  />
                </label>
                <label>
                  Category
                  <select
                    name="category"
                    required
                    value={form.category || ""}
                    onChange={change}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c[0].toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Price
                  <input
                    name="productPrice"
                    type="number"
                    min="0"
                    required
                    value={form.productPrice || ""}
                    onChange={change}
                  />
                </label>
                <label>
                  Stock
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    required
                    value={form.stock || ""}
                    onChange={change}
                  />
                </label>
                <label>
                  Image
                  <input
                    name="productImage"
                    type="file"
                    accept="image/*"
                    onChange={change}
                    required={!editing}
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  name="productDescription"
                  rows="4"
                  required
                  value={form.productDescription || ""}
                  onChange={change}
                />
              </label>
              <div className="row-actions">
                <button className="primary-btn">
                  {editing ? "Update product" : "Add product"}
                </button>
                {editing && (
                  <button
                    type="button"
                    className="outline-btn"
                    onClick={() => {
                      setEditing(null);
                      setForm(empty);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <div className="admin-list">
              <h2>Products ({products.length})</h2>
              {products.map((p) => (
                <div className="admin-item" key={p._id}>
                  <img src={p.productImage} alt="" />
                  <div>
                    <strong>{p.productName}</strong>
                    <p>
                      {p.category || "No category"} · Rs.{" "}
                      {Number(p.productPrice).toLocaleString()} · Stock{" "}
                      {p.stock}
                    </p>
                  </div>
                  <div className="row-actions">
                    <button className="outline-btn" onClick={() => edit(p)}>
                      Edit
                    </button>
                    <button className="danger-btn" onClick={() => del(p._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="orders-admin">
            {orderLoading ? (
              <div className="loading">Loading orders…</div>
            ) : !orders.length ? (
              <div className="empty">No orders found.</div>
            ) : (
              orders.map((o) => (
                <article className="admin-order" key={o._id}>
                  <div className="admin-order-head">
                    <div>
                      <strong>#{String(o._id).slice(-8).toUpperCase()}</strong>
                      <p className="muted">
                        {o.shippingAddress?.fullName} ·{" "}
                        {o.shippingAddress?.phone}
                      </p>
                      <small>{new Date(o.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="order-total">
                      Rs. {Number(o.totalAmount).toLocaleString()}
                    </div>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <OrderTimeline status={o.orderStatus} />
                  <div className="order-products">
                    {o.items?.map((item, i) => (
                      <div
                        className="order-product"
                        key={`${item.product}-${i}`}
                      >
                        <img src={item.productImage} alt="" />
                        <span>
                          {item.productName} × {item.quantity}
                        </span>
                        <strong>
                          Rs. {Number(item.subtotal).toLocaleString()}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <div className="row-actions">
                    <Link className="outline-btn" to={`/orders/${o._id}`}>
                      View order
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
