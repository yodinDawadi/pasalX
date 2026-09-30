import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  useEffect(() => {
    api.get(`/product/${id}`).then((r) => setProduct(r.data));
    api
      .get("/product")
      .then((r) => setRelated(r.data.filter((x) => x._id !== id).slice(0, 3)));
  }, [id]);
  if (!product) return <div className="loading section">Loading product…</div>;
  return (
    <section className="section">
      <div className="container">
        <Link className="back-link" to="/products">
          ← Back to products
        </Link>
        <div className="detail-grid">
          <div className="detail-image">
            <img src={product.productImage} alt={product.productName} />
          </div>
          <div className="detail-copy">
            <p className="eyebrow">PRODUCT</p>
            <h1>{product.productName}</h1>
            <p className="detail-price">
              Rs. {Number(product.productPrice).toLocaleString()}
            </p>
            <p>{product.productDescription}</p>
            <p className="stock">Stock: {product.stock}</p>
            <div className="quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button
              className="primary-btn"
              onClick={() => addToCart(product, qty)}
            >
              Add {qty} to cart
            </button>
          </div>
        </div>
        <div className="section-head related-head">
          <h2>Related products</h2>
        </div>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
