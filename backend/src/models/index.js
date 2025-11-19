const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Load models
const User = require("./user")(sequelize, DataTypes);
const Store = require("./store")(sequelize, DataTypes);
const Rating = require("./rating")(sequelize, DataTypes);

// Associations

// A Store belongs to a User (owner)
Store.belongsTo(User, { foreignKey: "owner_id", as: "owner" });
User.hasMany(Store, { foreignKey: "owner_id" });

// A Rating belongs to a User
Rating.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Rating, { foreignKey: "user_id" });

// A Rating belongs to a Store
Rating.belongsTo(Store, { foreignKey: "store_id" });
Store.hasMany(Rating, { foreignKey: "store_id" });

module.exports = { sequelize, User, Store, Rating };
