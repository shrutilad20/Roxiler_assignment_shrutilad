const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// ---------------- CREATE USER ----------------
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      role,
      password_hash,
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// ---------------- LIST USERS WITH FILTERS + SORTING ----------------
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sort = "name", order = "ASC" } = req.query;

    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      order: [[sort, order.toUpperCase()]],
      attributes: ["id", "name", "email", "address", "role"],
    });

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ---------------- GET USER DETAILS ----------------
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "address", "role"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};
