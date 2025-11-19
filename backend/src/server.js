require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully!");

    await sequelize.sync(); // creates tables

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
  }
})();
