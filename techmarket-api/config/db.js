const { Pool } = require('pg');
require("dotenv").config();

const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
  user: isTest ? process.env.TEST_DB_USER : process.env.DB_USER,
  host: isTest ? process.env.TEST_HOST : process.env.DB_HOST,
  database: isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  password: isTest ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
  port: isTest ? process.env.TEST_DB_PORT : process.env.DB_PORT,
});

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };



// require("dotenv").config();
// const { Pool } = require("pg");

// console.log("Database Config:");
// console.log("DB_HOST:", process.env.HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "Not Set");
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("DB_PORT:", process.env.DB_PORT);
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// const query = (text, params) => {
//   return pool.query(text, params);
// };

// module.exports = { pool, query };
