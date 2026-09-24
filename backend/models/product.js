const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productDescription: {
      type: String,
      required: true,
      trim: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Product", productSchema);
