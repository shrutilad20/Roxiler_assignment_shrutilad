const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/auth");
const { validate } = require("../middlewares/validation");

const {
  createUser,
  listUsers,
  getUserDetails
} = require("../controllers/adminUserController");

const { createUserSchema } = require("../validators/adminUser");

// CREATE USER
router.post(
  "/create",
  authenticate,
  authorize(["SYSTEM_ADMIN"]),
  validate(createUserSchema),
  createUser
);

// LIST USERS + FILTERS + SORTING
router.get(
  "/",
  authenticate,
  authorize(["SYSTEM_ADMIN"]),
  listUsers
);

// USER DETAILS
router.get(
  "/:id",
  authenticate,
  authorize(["SYSTEM_ADMIN"]),
  getUserDetails
);

module.exports = router;
