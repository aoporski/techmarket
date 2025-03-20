require("dotenv").config();
const { query } = require("./db");

const initDatabase = async () => {
  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT
    );
  `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  // usunąłem ręcznie starą kolumnę category ( ALTER TABLE "products" DROP COLUMN category;)
  const alterProductsTable = `
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS category_id INTEGER;
  `;

  const addForeignKeyConstraint = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_products_category'
      ) THEN
        ALTER TABLE products
        ADD CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
      END IF;
    END
    $$;
  `;

  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  try {
    await query(createCategoriesTable);
    await query(createUsersTable);
    await query(alterProductsTable);
    await query(addForeignKeyConstraint);
    await query(createReviewsTable);
  } catch (error) {
    console.error("Błąd inicjalizacji bazy danych:", error);
  }
};

initDatabase();