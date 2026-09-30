import React from "react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span>PX</span> PasalX
          </div>
          <p>Simple, modern online shopping for everyday products.</p>
        </div>
        <div>
          <strong>Shop</strong>
          <p>Products · Cart · Checkout</p>
        </div>
        <div>
          <strong>Project</strong>
          <p>CSC370 E-commerce</p>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} PasalX. Built for learning.
      </div>
    </footer>
  );
}
