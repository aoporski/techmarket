const { query } = require("../config/db");

const getAllProducts = async (filters) => {
  let sql = `
    SELECT p.*, c.name AS category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  let params = [];
  let conditions = [];

  if (filters.isAvailable !== undefined) {
      conditions.push(`p.is_available = $${params.length + 1}`);
      params.push(filters.isAvailable === "true");
  }

  const validSortFields = {
      "price": "p.price ASC",
      "-price": "p.price DESC"
  };

  if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
  }
  if (filters.sortBy && validSortFields[filters.sortBy]) {
      sql += ` ORDER BY ${validSortFields[filters.sortBy]}`;
  }

  const result = await query(sql, params);
  return result.rows;
};

const getProductById = async (id) => {
  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
};

const addNewProduct = async (productData) => {
  const { name, categoryId, description, price, stockCount, brand, imageUrl, isAvailable } = productData;

  const result = await query(
    `INSERT INTO products 
      (name, category_id, description, price, stock_count, brand, image_url, is_available)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, categoryId, description, price, stockCount, brand, imageUrl, isAvailable ?? true]
  );

  return result.rows[0];
};

const changeProduct = async (id, productData) => {
  const { name, categoryId, description, price, stockCount, brand, imageUrl, isAvailable } = productData;

  const result = await query(
    `UPDATE products SET 
      name = $1, 
      category_id = $2, 
      description = $3, 
      price = $4, 
      stock_count = $5, 
      brand = $6, 
      image_url = $7, 
      is_available = $8 
     WHERE id = $9 
     RETURNING *`,
    [name, categoryId, description, price, stockCount, brand, imageUrl, isAvailable, id]
  );

  return result.rows[0];
};

const deleteProduct = async (id) => {
  const result = await query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = {
  getAllProducts,
  getProductById,
  addNewProduct,
  changeProduct,
  deleteProduct,
};
