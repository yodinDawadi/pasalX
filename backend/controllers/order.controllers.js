const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");


// ======================================================
// CREATE ORDER
// POST /api/order
// ======================================================

async function createOrder(req, res) {
  const updatedProducts = [];

  try {
    const {
      items,
      shippingAddress,
      paymentMethod = "COD",
    } = req.body;

    // --------------------------------------------------
    // Check authenticated user
    // --------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "You must be logged in to place an order",
      });
    }

    // --------------------------------------------------
    // Validate payment method
    // --------------------------------------------------

    if (!["COD", "MOCK"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // --------------------------------------------------
    // Validate shipping information
    // --------------------------------------------------

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({
        message:
          "Full name, phone, address and city are required",
      });
    }

    // --------------------------------------------------
    // Validate order items
    // --------------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    // --------------------------------------------------
    // Merge duplicate products
    // --------------------------------------------------

    const productQuantities = new Map();

    for (const item of items) {
      const productId =
        item.productId ||
        item.product ||
        item._id;

      const quantity = Number(item.quantity);

      if (!productId) {
        return res.status(400).json({
          message: "Product ID is required",
        });
      }

      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({
          message: `Invalid product ID: ${productId}`,
        });
      }

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          message: "Quantity must be a positive integer",
        });
      }

      const id = String(productId);

      productQuantities.set(
        id,
        (productQuantities.get(id) || 0) + quantity
      );
    }

    // --------------------------------------------------
    // Get products from database
    // --------------------------------------------------

    const productIds = [...productQuantities.keys()];

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    });

    // --------------------------------------------------
    // Check whether all products exist
    // --------------------------------------------------

    if (products.length !== productIds.length) {
      const existingProducts = new Set(
        products.map((product) =>
          String(product._id)
        )
      );

      const missingProduct = productIds.find(
        (id) => !existingProducts.has(id)
      );

      return res.status(404).json({
        message: `Product not found: ${missingProduct}`,
      });
    }

    // --------------------------------------------------
    // Build order items
    // --------------------------------------------------

    const orderItems = [];

    let subtotal = 0;

    for (const product of products) {
      const quantity = productQuantities.get(
        String(product._id)
      );

      const stock = Number(product.stock);

      const price = Number(product.productPrice);

      // Check stock
      if (stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}. Available stock: ${stock}`,
        });
      }

      // Check price
      if (!Number.isFinite(price)) {
        return res.status(500).json({
          message: `Invalid price for ${product.productName}`,
        });
      }

      const itemSubtotal = price * quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,

        productName: product.productName,

        productImage: product.productImage,

        price: price,

        quantity: quantity,

        subtotal: itemSubtotal,
      });
    }

    // --------------------------------------------------
    // Calculate shipping
    // --------------------------------------------------

    // Free shipping for orders >= Rs. 5000
    const shippingFee =
      subtotal >= 5000 ? 0 : 100;

    const totalAmount =
      subtotal + shippingFee;

    // --------------------------------------------------
    // Reduce product stock
    // --------------------------------------------------

    for (const item of orderItems) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product,

            stock: {
              $gte: item.quantity,
            },
          },

          {
            $inc: {
              stock: -item.quantity,
            },
          },

          {
            new: true,
          }
        );

      // Something went wrong
      if (!updatedProduct) {
        // Restore previously changed products
        for (const previous of updatedProducts) {
          await Product.findByIdAndUpdate(
            previous.productId,
            {
              $inc: {
                stock: previous.quantity,
              },
            }
          );
        }

        return res.status(400).json({
          message:
            `Stock changed while placing order for ${item.productName}. Please try again.`,
        });
      }

      updatedProducts.push({
        productId: item.product,

        quantity: item.quantity,
      });
    }

    // --------------------------------------------------
    // Create order
    // --------------------------------------------------

    const order = await Order.create({
      user: req.user._id,

      items: orderItems,

      shippingAddress: {
        fullName:
          shippingAddress.fullName,

        phone:
          shippingAddress.phone,

        address:
          shippingAddress.address,

        city:
          shippingAddress.city,

        postalCode:
          shippingAddress.postalCode || "",
      },

      paymentMethod,

      paymentStatus:
        paymentMethod === "MOCK"
          ? "PAID"
          : "PENDING",

      orderStatus: "PLACED",

      subtotal,

      shippingFee,

      totalAmount,
    });

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(201).json({
      message: "Order placed successfully",

      order,
    });
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    // --------------------------------------------------
    // Restore stock if something failed
    // --------------------------------------------------

    for (const previous of updatedProducts) {
      try {
        await Product.findByIdAndUpdate(
          previous.productId,
          {
            $inc: {
              stock: previous.quantity,
            },
          }
        );
      } catch (restoreError) {
        console.error(
          "STOCK RESTORE ERROR:",
          restoreError
        );
      }
    }

    return res.status(500).json({
      message: "Failed to create order",
    });
  }
}


// ======================================================
// GET MY ORDERS
// GET /api/order/my-orders
// ======================================================

async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate(
        "items.product",
        "productName productImage productPrice"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(
      orders
    );
  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch your orders",
    });
  }
}


// ======================================================
// GET SINGLE ORDER
// GET /api/order/:id
// ======================================================

async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    // Find order
    const order = await Order.findById(id)
      .populate(
        "user",
        "username email"
      )
      .populate(
        "items.product",
        "productName productImage productPrice"
      );

    // Order doesn't exist
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check owner
    const isOwner =
      String(order.user._id) ===
      String(req.user._id);

    // Check admin
    const isAdmin =
      req.user.role === "admin";

    // Only owner or admin
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not allowed to view this order",
      });
    }

    return res.status(200).json(
      order
    );
  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch order",
    });
  }
}


// ======================================================
// GET ALL ORDERS
// GET /api/order
// ADMIN ONLY
// ======================================================

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "username email"
      )
      .populate(
        "items.product",
        "productName productImage productPrice"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(
      orders
    );
  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
}


// ======================================================
// UPDATE ORDER STATUS
// PATCH /api/order/:id/status
// ADMIN ONLY
// ======================================================

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;

    const {
      orderStatus,
      paymentStatus,
    } = req.body;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    // Allowed order statuses
    const allowedOrderStatuses = [
      "PLACED",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    // Allowed payment statuses
    const allowedPaymentStatuses = [
      "PENDING",
      "PAID",
      "FAILED",
    ];

    // Validate order status
    if (
      orderStatus &&
      !allowedOrderStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // Validate payment status
    if (
      paymentStatus &&
      !allowedPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    // Nothing provided
    if (
      !orderStatus &&
      !paymentStatus
    ) {
      return res.status(400).json({
        message:
          "Provide orderStatus or paymentStatus",
      });
    }

    const updateData = {};

    if (orderStatus) {
      updateData.orderStatus =
        orderStatus;
    }

    if (paymentStatus) {
      updateData.paymentStatus =
        paymentStatus;
    }

    const order =
      await Order.findByIdAndUpdate(
        id,

        updateData,

        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "user",
          "username email"
        )
        .populate(
          "items.product",
          "productName productImage productPrice"
        );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message:
        "Order updated successfully",

      order,
    });
  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to update order",
    });
  }
}


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};