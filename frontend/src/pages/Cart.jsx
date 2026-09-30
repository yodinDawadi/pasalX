import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!items.length)
    return (
      <section className="section">
        <div className="container empty large">
          <p className="eyebrow">YOUR CART</p>
          <h1>Your cart is empty</h1>
          <p>Add a few products and come back here.</p>
          <Link className="primary-btn" to="/products">
            Browse products
          </Link>
        </div>
      </section>
    );
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">YOUR CART</p>
        <h1>Shopping cart</h1>
        <div className="cart-layout">
          <div>
            {items.map((x) => (
              <div className="cart-row" key={x.product._id}>
                <img src={x.product.productImage} alt="" />
                <div className="cart-main">
                  <Link to={`/products/${x.product._id}`}>
                    <h3>{x.product.productName}</h3>
                  </Link>
                  <span>
                    Rs. {Number(x.product.productPrice).toLocaleString()}
                  </span>
                  <div className="quantity">
                    <button
                      onClick={() =>
                        updateQuantity(x.product._id, x.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{x.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(x.product._id, x.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove"
                  onClick={() => removeFromCart(x.product._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h2>Summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>Rs. {subtotal.toLocaleString()}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>Calculated at checkout</strong>
            </div>
            <hr />
            <div className="total">
              <span>Total</span>
              <strong>Rs. {subtotal.toLocaleString()}</strong>
            </div>
            <button
              className="primary-btn full"
              onClick={() =>
                user ? navigate("/checkout") : navigate("/login")
              }
            >
              Proceed to checkout
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
