const express = require('express')
const cors = require('cors');
const app = express();
const userRoutes = require("./routes/user")


app.use(cors());
app.use(express.json());

//routes
app.use("/api/user",userRoutes);

module.exports ={app}