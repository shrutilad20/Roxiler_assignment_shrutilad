const router = require("express").Router();
const { signup, login } = require("../controllers/authController");
const { validate } = require("../middlewares/validation");
const { signupSchema, loginSchema } = require("../validators/auth");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

module.exports = router;
