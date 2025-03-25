const { query } = require("../config/db");

const getAllReviews = async () => {
  const sql = `
    SELECT r.*, p.name AS product_name, u.username AS user_name
    FROM reviews r
    LEFT JOIN products p ON r.product_id = p.id
    LEFT JOIN users u ON r.user_id = u.id
  `;
  const result = await query(sql, []);
  return result.rows;
};

const getReviewById = async (id) => {
  const sql = `
    SELECT r.*, p.name AS product_name, u.username AS user_name
    FROM reviews r
    LEFT JOIN products p ON r.product_id = p.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = $1
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
};

const addNewReview = async ({ productId, userId, rating, comment }) => {
  const result = await query(
    `INSERT INTO reviews (product_id, user_id, rating, comment) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [productId, userId, rating, comment]
  );
  return result.rows[0];
};

const changeReview = async (id, { productId, userId, rating, comment }) => {
  const result = await query(
    `UPDATE reviews 
     SET product_id = $1, user_id = $2, rating = $3, comment = $4 
     WHERE id = $5 RETURNING *`,
    [productId, userId, rating, comment, id]
  );
  return result.rows[0];
};

const deleteReview = async (id) => {
  const result = await query("DELETE FROM reviews WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

const getReviewsForProduct = async (productId) => {
    const sql = `
      SELECT *
      FROM reviews
      WHERE product_id = $1
      ORDER BY created_at DESC
    `;
    const result = await query(sql, [productId]);
    return result.rows;
  };

module.exports = {
  getAllReviews,
  getReviewById,
  addNewReview,
  changeReview,
  deleteReview,
  getReviewsForProduct
};
