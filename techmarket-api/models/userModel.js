const { query } = require("../config/db");

const getAllUsers = async () => {
  const result = await query("SELECT * FROM users", []);
  return result.rows;
};

const getUserById = async (id) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

const addNewUser = async ({ username, email, passwordHash, firstName, lastName }) => {
  const result = await query(
    `INSERT INTO users (username, email, password_hash, first_name, last_name) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [username, email, passwordHash, firstName, lastName]
  );
  return result.rows[0];
};

const changeUser = async (id, { username, email, passwordHash, firstName, lastName }) => {
  const result = await query(
    `UPDATE users 
     SET username = $1, email = $2, password_hash = $3, first_name = $4, last_name = $5 
     WHERE id = $6 RETURNING *`,
    [username, email, passwordHash, firstName, lastName, id]
  );
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  addNewUser,
  changeUser,
  deleteUser,
};
