const { User, Store, Rating } = require("../models");

exports.getDashboardStats = async (req, res) => {
  try {
    const total_users = await User.count();
    const total_stores = await Store.count();
    const total_ratings = await Rating.count();

    return res.json({
      total_users,
      total_stores,
      total_ratings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
