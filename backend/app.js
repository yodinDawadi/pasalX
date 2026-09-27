const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require('cors');
const app = express();
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product");


app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/user",userRoutes);
app.use("/api/product", productRoutes);

module.exports ={app}