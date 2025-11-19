const { Rating, Store, User, sequelize } = require("../models");
const { Op } = require("sequelize");

/**
 * Submit or update rating for a store by logged-in user.
 * POST /api/stores/:id/rating
 * body: { rating, comment }
 */
exports.submitOrUpdateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.id, 10);
    const { rating, comment } = req.body;

    // check store exists
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // upsert: if exists update, else create
    const [record, created] = await Rating.findOrCreate({
      where: { user_id: userId, store_id: storeId },
      defaults: { rating, comment }
    });

    if (!created) {
      record.rating = rating;
      if (comment !== undefined) record.comment = comment;
      await record.save();
      return res.json({ message: "Rating updated", rating: record });
    }

    return res.status(201).json({ message: "Rating created", rating: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};

/**
 * Get ratings for a store (paginated)
 * GET /api/stores/:id/ratings
 * Query: page, limit
 * Public endpoint (but authenticated user can see own rating via separate route)
 */
exports.getStoreRatings = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id, 10);
    const page = parseInt(req.query.page || 1, 10);
    const limit = Math.min(parseInt(req.query.limit || 20, 10), 100);
    const offset = (page - 1) * limit;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    const { rows: ratings, count } = await Rating.findAndCountAll({
      where: { store_id: storeId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    // compute avg rating
    const avgRes = await Rating.findOne({
      where: { store_id: storeId },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avg_rating"]]
    });
    const avg_rating = parseFloat(avgRes?.get("avg_rating")) || 0;

    res.json({
      store: { id: store.id, name: store.name, address: store.address },
      meta: { page, limit, total: count },
      avg_rating,
      ratings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

/**
 * Get current user's rating for a store
 * GET /api/stores/:id/my-rating  (auth required)
 */
exports.getMyRatingForStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.id, 10);

    const rating = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (!rating) return res.json({ rating: null });

    return res.json({ rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user's rating" });
  }
};

/**
 * Store owner listing of raters and avg (owner-only)
 * GET /api/owner/stores/:id/ratings
 */
exports.ownerStoreRatings = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id, 10);
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // ensure req.user is owner or admin — middleware ensures this but double-check
    if (req.user.role !== "SYSTEM_ADMIN" && store.owner_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]]
    });

    const avgRes = await Rating.findOne({
      where: { store_id: storeId },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avg_rating"], [sequelize.fn("COUNT", sequelize.col("id")), "count"]]
    });

    const avg_rating = parseFloat(avgRes?.get("avg_rating")) || 0;
    const total = parseInt(avgRes?.get("count") || 0, 10);

    res.json({ store: { id: store.id, name: store.name }, avg_rating, total, ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch owner ratings" });
  }
};
