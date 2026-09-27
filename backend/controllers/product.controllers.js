const Product = require("../models/product");
async function addProduct(req, res) {
  const { productName, productDescription, productImage, productPrice, stock } =
    req.body;
}
