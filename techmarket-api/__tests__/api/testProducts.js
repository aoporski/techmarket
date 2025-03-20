const request = require('supertest');
const app = require('../../app');
const { query } = process.env.NODE_ENV === 'test'
  ? require('../../config/dbTest')
  : require('../../config/db');

describe('Products API', () => {
  let categoryId;

  beforeAll(async () => {
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_id INT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock_count INT NOT NULL,
        brand VARCHAR(100),
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);
  });

  beforeEach(async () => {
    await query(`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`);
    await query(`TRUNCATE TABLE categories RESTART IDENTITY CASCADE;`);
    const result = await query(`INSERT INTO categories (name, description) VALUES ('Laptopy', 'Dział laptopów') RETURNING id;`);
    categoryId = result.rows[0].id;
  });

  afterAll(async () => {
    await query(`DROP TABLE IF EXISTS products;`);
    await query(`DROP TABLE IF EXISTS categories;`);
  });

  it('GET /api/products - powinno zwrócić pustą listę', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/products - powinno dodać produkt', async () => {
    const res = await request(app).post('/api/products').send({
      name: "MacBook",
      categoryId: categoryId,
      description: "Opis",
      price: 999.99,
      stockCount: 10,
      brand: "Apple",
      imageUrl: "http://example.com/macbook.jpg",
      isAvailable: true
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("MacBook");
  });

  it('GET /api/products/:id - powinno zwrócić dodany produkt', async () => {
    const insert = await query(`
      INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url) 
      VALUES ('MacBook', ${categoryId}, 'Opis', 999.99, 10, 'Apple', 'http://example.com/macbook.jpg') RETURNING id;
    `);

    const res = await request(app).get(`/api/products/${insert.rows[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("MacBook");
  });

  it('PUT /api/products/:id - powinno zaktualizować produkt', async () => {
    const insert = await query(`
      INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url) 
      VALUES ('MacBook', ${categoryId}, 'Opis', 999.99, 10, 'Apple', 'http://example.com/macbook.jpg') RETURNING id;
    `);

    const res = await request(app).put(`/api/products/${insert.rows[0].id}`).send({
      name: "MacBook Pro",
      categoryId: categoryId,
      description: "Nowy opis",
      price: 1099.99,
      stockCount: 5,
      brand: "Apple",
      imageUrl: "http://example.com/macbook-pro.jpg",
      isAvailable: true
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("MacBook Pro");
  });

  it('DELETE /api/products/:id - powinno usunąć produkt', async () => {
    const insert = await query(`
      INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url) 
      VALUES ('MacBook', ${categoryId}, 'Opis', 999.99, 10, 'Apple', 'http://example.com/macbook.jpg') RETURNING id;
    `);

    const res = await request(app).delete(`/api/products/${insert.rows[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/usunięty/);
  });
});