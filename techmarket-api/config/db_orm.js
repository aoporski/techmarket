require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("Database Config:");
console.log("DB_HOST:", process.env.HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "Not Set");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, 
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Połączono z bazą danych przez Sequelize.");
  } catch (error) {
    console.error("Błąd połączenia z bazą przez Sequelize:", error);
  }
};

module.exports = { sequelize, testConnection };
