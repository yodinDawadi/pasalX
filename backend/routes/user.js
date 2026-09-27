const express = require("express");
const { handleLogin, handleSignup ,handleLogout} = require("../controllers/auth.controllers");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("User route");
});
router.post("/login", handleLogin).post("/signup", handleSignup).post("/logout",handleLogout);
module.exports = router;
