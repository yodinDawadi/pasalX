const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");

// CREATE
async function addProduct(req, res) {
  try {
    const { productName, productDescription, productPrice, stock } =
      req.body;
      const productImage = req.file?.path;

    if (
      !productName ||
      !productDescription ||
      !productImage ||
      !productPrice ||
      !stock
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      productName,
      productDescription,
      productImage,
      productPrice,
      stock,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product Added Successfully", product: newProduct });
  } catch (error) {
    console.error("add product error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// READ - get all products
async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("get products error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// READ - get single product by id
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("get product error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// UPDATE
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { productName, productDescription, productPrice, stock } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = { productName, productDescription, productPrice, stock };

    // If a new image was uploaded, replace it and clean up the old one
    if (req.file) {
      updateData.productImage = req.file.path;

      // delete old image from Cloudinary, if it exists
      if (existingProduct.productImage) {
        const publicId = getCloudinaryPublicId(existingProduct.productImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch((err) => {
            console.error("Failed to delete old Cloudinary image:", err);
            // don't block the update if cleanup fails — just log it
          });
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Product Updated Successfully", product: updatedProduct });
  } catch (error) {
    console.error("update product error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Helper: extract Cloudinary public_id from a stored image URL
function getCloudinaryPublicId(url) {
  try {
    // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123456/products/abc123.jpg
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1]; // abc123.jpg
    const folder = parts[parts.length - 2];      // products
    const publicId = `${folder}/${fileWithExt.split(".")[0]}`; // products/abc123
    return publicId;
  } catch {
    return null;
  }
}

// DELETE
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.productImage) {
      const publicId = getCloudinaryPublicId(product.productImage);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch((err) => {
          console.error("Failed to delete Cloudinary image:", err);
        });
      }
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    console.error("delete product error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};