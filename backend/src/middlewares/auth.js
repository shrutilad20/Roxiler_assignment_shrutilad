const jwt = require("jsonwebtoken");
const { User, Store } = require("../models");

// ---------------- AUTHENTICATE ----------------
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Authentication failed" });
  }
};

// ---------------- AUTHORIZE ROLE ----------------
exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// ---------------- ENSURE STORE OWNER ----------------
// Used for: /api/owner/stores/:id/ratings
// Only store owner or admin should access
exports.ensureStoreOwner = async (req, res, next) => {
  try {
    const storeId = req.params.id;
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Allow Admin or actual Owner
    if (req.user.role === "SYSTEM_ADMIN" || store.owner_id === req.user.id) {
      req.store = store;
      return next();
    }

    return res.status(403).json({ message: "You are not the owner of this store" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed ownership validation" });
  }
};
