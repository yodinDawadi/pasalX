import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import OrderTimeline from "../components/OrderTimeline";
export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/order/my-orders")
      .then((r) =>
        setOrders(Array.isArray(r.data) ? r.data : r.data.orders || []),
      )
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load orders"),
      )
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">ACCOUNT</p>
            <h1>My orders</h1>
            <p className="muted">Track your purchases and delivery status.</p>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        {loading ? (
          <div className="loading">Loading orders…</div>
        ) : !orders.length ? (
          <div className="empty">
            <h2>No orders yet</h2>
            <p className="muted">Your placed orders will appear here.</p>
            <Link className="primary-btn" to="/products">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((o) => (
              <article className="order-card" key={o._id}>
                <div className="order-card-head">
                  <div>
                    <strong>
                      Order #{String(o._id).slice(-8).toUpperCase()}
                    </strong>
                    <p className="muted">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <strong>Rs. {Number(o.totalAmount).toLocaleString()}</strong>
                </div>
                <OrderTimeline status={o.orderStatus} />
                <div className="order-products">
                  {o.items?.map((item, i) => (
                    <div className="order-product" key={`${item.product}-${i}`}>
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
                    View order details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
