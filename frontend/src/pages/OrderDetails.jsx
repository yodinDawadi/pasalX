import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../services/api";
import OrderTimeline from "../components/OrderTimeline";
export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get(`/order/${id}`)
      .then((r) => setOrder(r.data.order || r.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load order"),
      );
  }, [id]);
  if (error)
    return (
      <section className="section">
        <div className="container error">{error}</div>
      </section>
    );
  if (!order) return <div className="loading section">Loading order…</div>;
  return (
    <section className="section">
      <div className="container">
        <Link className="back-link" to="/orders">
          ← Back to my orders
        </Link>
        {location.state?.placed && (
          <div className="notice">Your order was placed successfully.</div>
        )}
        <div className="order-detail-head">
          <div>
            <p className="eyebrow">ORDER</p>
            <h1>#{String(order._id).slice(-8).toUpperCase()}</h1>
            <p className="muted">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <strong className="detail-price">
            Rs. {Number(order.totalAmount).toLocaleString()}
          </strong>
        </div>
        <div className="order-tracking">
          <h2>Order tracking</h2>
          <OrderTimeline status={order.orderStatus} />
        </div>
        <div className="order-detail-grid">
          <div className="summary">
            <h2>Items</h2>
            {order.items?.map((item, i) => (
              <div className="order-product" key={`${item.product}-${i}`}>
                <img src={item.productImage} alt="" />
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <strong>Rs. {Number(item.subtotal).toLocaleString()}</strong>
              </div>
            ))}
          </div>
          <div className="summary">
            <h2>Delivery</h2>
            <p>
              <strong>{order.shippingAddress?.fullName}</strong>
            </p>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city} {order.shippingAddress?.postalCode}
            </p>
            <hr />
            <div className="mini-line">
              <span>Payment</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div className="mini-line">
              <span>Payment status</span>
              <strong>{order.paymentStatus}</strong>
            </div>
            <div className="mini-line">
              <span>Shipping</span>
              <strong>
                Rs. {Number(order.shippingFee || 0).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
