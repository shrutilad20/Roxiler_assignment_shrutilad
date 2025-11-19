const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password, address } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const password_hash = await bcrypt.hash(password, 10);

 const user = await User.create({
  name,
  email,
  password_hash,
  address,
  role: req.body.role || "NORMAL_USER",
});

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN BODY:", req.body);

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ADD THESE
  console.log("USER FROM DB:", user.toJSON());
  console.log("PASSWORD_HASH:", user.password_hash);

  const valid = await bcrypt.compare(password, user.password_hash);
  console.log("PASSWORD VALID:", valid);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};
