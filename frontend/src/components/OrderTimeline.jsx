import React from "react";
const steps = ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
const labels = {
  PLACED: "Order placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};
export default function OrderTimeline({ status }) {
  if (status === "CANCELLED")
    return (
      <div className="timeline cancelled">
        <div className="timeline-step current">
          <span>×</span>
          <div>
            <strong>Order cancelled</strong>
            <small>This order has been cancelled.</small>
          </div>
        </div>
      </div>
    );
  const current = Math.max(0, steps.indexOf(status));
  return (
    <div className="timeline">
      {steps.map((step, i) => (
        <div
          className={`timeline-step ${i < current ? "done" : ""} ${i === current ? "current" : ""}`}
          key={step}
        >
          <span>{i < current ? "✓" : i === current ? "●" : "○"}</span>
          <div>
            <strong>{labels[step]}</strong>
            {i === current && <small>Current status</small>}
          </div>
        </div>
      ))}
    </div>
  );
}
