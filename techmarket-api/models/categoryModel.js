// const { query } = require("../config/db");
const { query } = process.env.NODE_ENV === 'test'
  ? require('../config/dbTest')
  : require('../config/db');

const getAllCategories = async () => {
  const result = await query("SELECT * FROM categories", []);
  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await query("SELECT * FROM categories WHERE id = $1", [id]);
  return result.rows[0];
};

const addNewCategory = async ({ name, description }) => {
  const result = await query(
    "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );
  return result.rows[0];
};

const changeCategory = async (id, { name, description }) => {
  const result = await query(
    "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, id]
  );
  return result.rows[0];
};

const deleteCategory = async (id) => {
  const result = await query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addNewCategory,
  changeCategory,
  deleteCategory,
};
