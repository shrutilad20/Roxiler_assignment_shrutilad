module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

      user_id: { type: DataTypes.INTEGER, allowNull: false },

      store_id: { type: DataTypes.INTEGER, allowNull: false },

      rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
      },

      comment: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      tableName: "ratings",
      timestamps: true,
      indexes: [{ unique: true, fields: ["user_id", "store_id"] }] // one rating per store
    }
  );

  return Rating;
};
