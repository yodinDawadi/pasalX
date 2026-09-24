const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGOURI = process.env.MONGOURI;
async function connectDatabase() {
  await mongoose.connect(MONGOURI);
  console.log("Connected to MongoDB");
}

module.exports = { connectDatabase };
