import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api
      .get("/product")
      .then((r) => setProducts(r.data))
      .catch(console.error);
  }, []);
  const latest = useMemo(() => [...products].reverse().slice(0, 4), [products]);
  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">WELCOME TO PASALX</p>
            <h1>
              Shop what you need.
              <br />
              <em>Love what you get.</em>
            </h1>
            <p className="hero-copy">
              A clean e-commerce experience with secure accounts, product
              discovery and a simple checkout flow.
            </p>
            <div className="hero-actions">
              <Link className="primary-btn" to="/products">
                Explore products
              </Link>
              <Link className="text-link" to="/signup">
                Create account →
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-orb">PX</div>
            <p>Fresh products</p>
            <strong>Simple shopping, better discovery.</strong>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">DISCOVER</p>
              <h2>Latest products</h2>
            </div>
            <Link to="/products" className="text-link">
              View all →
            </Link>
          </div>
          {latest.length ? (
            <div className="product-grid">
              {latest.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              No products yet. Add products from the admin panel.
            </div>
          )}
        </div>
      </section>
      <section className="feature-strip">
        <div className="container feature-grid">
          <div>
            <b>01</b>
            <h3>Easy discovery</h3>
            <p>Search and browse your catalog quickly.</p>
          </div>
          <div>
            <b>02</b>
            <h3>Simple cart</h3>
            <p>Keep your shopping cart between visits.</p>
          </div>
          <div>
            <b>03</b>
            <h3>Ready to checkout</h3>
            <p>Review your order before placing it.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
