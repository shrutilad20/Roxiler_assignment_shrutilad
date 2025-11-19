const router = require("express").Router();

const { authenticate, authorize } = require("../middlewares/auth");

const {
  createStore,
  getStores,
  updateStore,
  deleteStore,
  getPublicStores
} = require("../controllers/storeController");

// CREATE STORE (Admin Only)
router.post(
  "/",
  authenticate,
  authorize(["SYSTEM_ADMIN"]),
  createStore
);

// GET ALL STORES (Admin Only)
router.get(
  "/",
  authenticate,
  authorize(["SYSTEM_ADMIN"]),
  getStores
);

// UPDATE STORE
router.put(
  "/:id",
  authenticate,
  authorize(["SYSTEM_ADMIN"]),
  updateStore
);

// DELETE STORE
router.delete(
  "/:id",
  authenticate,
  authorize(["SYSTEM_ADMIN"]),
  deleteStore
);

// PUBLIC STORE LIST (Normal Users)
router.get(
  "/public",
  authenticate,
  getPublicStores   // <-- THIS WAS CAUSING CRASH
);

module.exports = router;
