const { getUser } = require("../service/auth");

async function restrictToUserLoggedInUserOnly(req, res, next) {
  try {
    const userUid = req.cookies?.uid;
    if (!userUid) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await getUser(userUid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("auth middleware error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

function restrictToAdminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

module.exports = { restrictToUserLoggedInUserOnly,restrictToAdminOnly };