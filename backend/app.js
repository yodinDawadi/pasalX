const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require('cors');
const app = express();
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order")


app.use(
  cors({
    origin: "https://frontend-eight-kappa-0x7xr60nei.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/user",userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order",orderRoutes)

module.exports ={app}