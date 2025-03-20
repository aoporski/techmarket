require("dotenv").config();
const { Pool } = require("pg");

console.log("Database Test Config:");
console.log("TEST_DB_HOST:", process.env.TEST_HOST);
console.log("TEST_DB_USER:", process.env.TEST_DB_USER);
console.log("TEST_DB_NAME:", process.env.TEST_DB_NAME);
console.log("TEST_DB_PORT:", process.env.TEST_DB_PORT);

const pool = new Pool({
  user: process.env.TEST_DB_USER,
  host: process.env.TEST_HOST,
  database: process.env.TEST_DB_NAME, 
  password: process.env.TEST_DB_PASSWORD,
  port: process.env.TEST_DB_PORT,
});

const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = { pool, query };
