const { Store, User, Rating, sequelize } = require("../models");
const { Op } = require("sequelize");

// ---------------- CREATE STORE (ADMIN) ----------------
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner || owner.role !== "STORE_OWNER") {
        return res.status(400).json({ message: "Invalid store owner" });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      owner_id: owner_id || null
    });

    res.status(201).json({ message: "Store created", store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create store" });
  }
};

// ---------------- GET ALL STORES (ADMIN) ----------------
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "name", "email"]
      }
    });

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};

// ---------------- UPDATE STORE ----------------
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    const { name, email, address, owner_id } = req.body;

    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner || owner.role !== "STORE_OWNER") {
        return res.status(400).json({ message: "Invalid store owner" });
      }
    }

    await store.update({
      name: name || store.name,
      email: email || store.email,
      address: address || store.address,
      owner_id: owner_id || store.owner_id
    });

    res.json({ message: "Store updated", store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update store" });
  }
};

// ---------------- DELETE STORE ----------------
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    await store.destroy();
    res.json({ message: "Store deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete store" });
  }
};

// ---------------- PUBLIC STORE LISTING ----------------
exports.getPublicStores = async (req, res) => {
  try {
    const search = req.query.search || "";
    const userId = req.user?.id || null;

    const stores = await Store.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ]
      },
      attributes: ["id", "name", "address"]
    });

    const result = [];

    for (let store of stores) {
      const avg = await Rating.findOne({
        where: { store_id: store.id },
        attributes: [
          [sequelize.fn("AVG", sequelize.col("rating")), "avg_rating"]
        ]
      });

      const avg_rating = parseFloat(avg?.get("avg_rating")) || 0;

      let userRating = null;
      if (userId) {
        const rating = await Rating.findOne({
          where: { store_id: store.id, user_id: userId },
          attributes: ["rating"]
        });
        userRating = rating ? rating.rating : null;
      }

      result.push({
        id: store.id,
        name: store.name,
        address: store.address,
        avg_rating,
        my_rating: userRating
      });
    }

    res.json({ stores: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stores" });
  }
};
