// routes/product.js
const express = require("express");
const upload = require("../middleware/uploads");
const { restrictToUserLoggedInUserOnly, restrictToAdminOnly } = require("../middleware/auth");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controllers");
const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only
router.post("/", restrictToUserLoggedInUserOnly, restrictToAdminOnly,upload.single("productImage"), addProduct);
router.put("/:id", restrictToUserLoggedInUserOnly, restrictToAdminOnly,upload.single("productImage"), updateProduct);
router.delete("/:id", restrictToUserLoggedInUserOnly, restrictToAdminOnly, deleteProduct);

module.exports = router;