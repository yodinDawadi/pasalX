const express = require("express");

const router = express.Router();

const {
  restrictToUserLoggedInUserOnly,
  restrictToAdminOnly,
} = require("../middleware/auth");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controllers");


// ======================================================
// CUSTOMER ROUTES
// ======================================================

// Create order
// POST /api/order
router.post(
  "/",
  restrictToUserLoggedInUserOnly,
  createOrder
);


// Get logged-in user's orders
// GET /api/order/my-orders
router.get(
  "/my-orders",
  restrictToUserLoggedInUserOnly,
  getMyOrders
);


// ======================================================
// ADMIN ROUTES
// ======================================================

// Get all orders
// GET /api/order
router.get(
  "/",
  restrictToUserLoggedInUserOnly,
  restrictToAdminOnly,
  getAllOrders
);


// Update order status
// PATCH /api/order/:id/status
router.patch(
  "/:id/status",
  restrictToUserLoggedInUserOnly,
  restrictToAdminOnly,
  updateOrderStatus
);


// ======================================================
// SINGLE ORDER
// ======================================================

// Get single order
// GET /api/order/:id
router.get(
  "/:id",
  restrictToUserLoggedInUserOnly,
  getOrderById
);


module.exports = router;