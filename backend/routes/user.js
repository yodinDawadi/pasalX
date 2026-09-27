const express = require("express");
const { handleLogin, handleSignup } = require("../controllers/auth.controllers");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("User route");
});
router.post("/login", handleLogin).post("/signup", handleSignup);
module.exports = router;
