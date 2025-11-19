module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },

      role: {
        type: DataTypes.ENUM("SYSTEM_ADMIN", "NORMAL_USER", "STORE_OWNER"),
        defaultValue: "NORMAL_USER",
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
