module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "Store",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

      name: { type: DataTypes.STRING(255), allowNull: false },

      email: { type: DataTypes.STRING(255), allowNull: true },

      address: { type: DataTypes.STRING(400), allowNull: true },

      owner_id: { type: DataTypes.INTEGER, allowNull: true } // Store owner (User)
    },
    { tableName: "stores", timestamps: true }
  );

  return Store;
};
