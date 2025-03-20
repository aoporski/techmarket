const { query } = require("./db");
const products = require("../data/products");

const insertProducts = async () => {
  try {
    for (const product of products) {
      await query(
        `INSERT INTO products 
        (name, category_id, description, price, stock_count, brand, image_url, is_available, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        ON CONFLICT (id) DO NOTHING`, 
        [
          product.name,
          product.categoryId,
          product.description,
          product.price,
          product.stockCount,
          product.brand,
          product.imageUrl,
          product.isAvailable,
          product.createdAt,
        ]
      );
    }
    console.log("All products inserted successfully!");
  } catch (error) {
    console.error("Error inserting products:", error);
  } finally {
    process.exit();
  }
};

insertProducts();
