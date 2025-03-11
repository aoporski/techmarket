const { query } = require("./db");

const createTable = async () => {
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock_count INT NOT NULL,
      brand VARCHAR(100),
      image_url TEXT,
      is_available BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await query(createProductsTable);
    console.log("Tabela 'products' została utworzona.");
  } catch (error) {
    console.error("Błąd tworzenia tabeli:", error);
  }
};

createTable();
