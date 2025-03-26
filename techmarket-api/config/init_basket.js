require("dotenv").config();
const { sequelize } = require('./db_orm');
const Basket = require('../models/basketModel');

sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database synchronized")) 
  .catch(err => console.error(err));

// just one run to create table