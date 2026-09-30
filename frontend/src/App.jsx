import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";

export default function App(){
 return <Layout><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/products" element={<Products/>}/>
  <Route path="/products/:id" element={<ProductDetails/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/signup" element={<Signup/>}/>
  <Route path="/cart" element={<Cart/>}/>
  <Route element={<ProtectedRoute/>}><Route path="/checkout" element={<Checkout/>}/><Route path="/orders" element={<MyOrders/>}/><Route path="/orders/:id" element={<OrderDetails/>}/></Route>
  <Route element={<ProtectedRoute adminOnly/>}><Route path="/admin" element={<Admin/>}/></Route>
  <Route path="*" element={<Home/>}/>
 </Routes></Layout>;
}