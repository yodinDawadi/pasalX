import React from "react";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/product")
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
  }, []);
  const visible = useMemo(() => {
    const filtered = products.filter((p) =>
      `${p.productName} ${p.productDescription}`
        .toLowerCase()
        .includes(q.toLowerCase()),
    );
    return [...filtered].sort((a, b) =>
      sort === "price-low"
        ? a.productPrice - b.productPrice
        : sort === "price-high"
          ? b.productPrice - a.productPrice
          : new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [products, q, sort]);
  return (
    <section className="section products-page">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">CATALOG</p>
            <h1>All products</h1>
            <p className="muted">{products.length} products available</p>
          </div>
        </div>
        <div className="toolbar">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
        {loading ? (
          <div className="loading">Loading products…</div>
        ) : visible.length ? (
          <div className="product-grid">
            {visible.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">No matching products.</div>
        )}
      </div>
    </section>
  );
}
