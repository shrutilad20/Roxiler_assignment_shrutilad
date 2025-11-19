const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const storeRoutes = require("./routes/stores");
const ratingRoutes = require("./routes/ratings");
const adminUserRoutes = require("./routes/adminUsers");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// ------------------ ROUTES ------------------

// Auth Routes
app.use("/api/auth", authRoutes);

// Admin Dashboard Routes
app.use("/api/admin", adminRoutes);

// Admin User Management
app.use("/api/admin/users", adminUserRoutes);

// Store Routes (admin CRUD + public listing)
app.use("/api/stores", storeRoutes);

// Rating Routes
app.use("/api", ratingRoutes);

module.exports = app;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlNZU1RFTV9BRE1JTiIsImlhdCI6MTc2MzU0MDU3Nn0.x8PCUe0Haiv6BRwTjB9vmw9rE-lD6nA84Occ5SouBas