import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import React from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return <article className="product-card">
    <Link to={`/products/${product._id}`} className="product-image-wrap">
      <img src={product.productImage} alt={product.productName} />
    </Link>
    <div className="product-info">
      <Link to={`/products/${product._id}`}><h3>{product.productName}</h3></Link>
      <p className="muted">{product.productDescription}</p>
      <div className="product-bottom">
        <strong>Rs. {Number(product.productPrice).toLocaleString()}</strong>
        <button className="small-btn" onClick={() => addToCart(product)}>Add</button>
      </div>
    </div>
  </article>;
}