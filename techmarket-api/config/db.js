require("dotenv").config();
const { Pool } = require("pg");

console.log("Database Config:");
console.log("DB_HOST:", process.env.HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "Not Set");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = { pool, query };
