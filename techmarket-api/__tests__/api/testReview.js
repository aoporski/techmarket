const request = require('supertest');
const app = require('../../app');
// const { query } = process.env.NODE_ENV === 'test'
//   ? require('../../config/dbTest')
//   : require('../../config/db');
const { query } = require('../../config/dbTest');

describe('Reviews API', () => {
  let productId, userId;

  beforeAll(async () => {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100)
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
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  });

  beforeEach(async () => {
    await query(`TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;`);
    await query(`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`);
    await query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);

    const user = await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('tester', 'test@example.com', 'hash', 'John', 'Doe') RETURNING id;`);
    const product = await query(`INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url) VALUES ('Laptop', 1, 'desc', 1000, 5, 'Brand', 'url') RETURNING id;`);

    userId = user.rows[0].id;
    productId = product.rows[0].id;
  });

  afterAll(async () => {
    await query(`DROP TABLE IF EXISTS reviews;`);
    await query(`DROP TABLE IF EXISTS products;`);
    await query(`DROP TABLE IF EXISTS users;`);
  });

  it('POST /api/reviews - powinno dodać recenzję', async () => {
    const res = await request(app).post('/api/reviews').send({
      productId: productId,
      userId: userId,
      rating: 5,
      comment: "Super!"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.rating).toBe(5);
  });

  it('GET /api/reviews - powinno zwrócić recenzje', async () => {
    await query(`INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (${productId}, ${userId}, 4, 'Good')`);
    const res = await request(app).get('/api/reviews');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /api/reviews/:id - powinno zwrócić recenzję po ID', async () => {
    const insert = await query(`INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (${productId}, ${userId}, 4, 'Good') RETURNING id;`);
    const res = await request(app).get(`/api/reviews/${insert.rows[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.rating).toBe(4);
  });

  it('PUT /api/reviews/:id - powinno zaktualizować recenzję', async () => {
    const insert = await query(`INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (${productId}, ${userId}, 3, 'Ok') RETURNING id;`);

    const res = await request(app).put(`/api/reviews/${insert.rows[0].id}`).send({
      productId: productId,
      userId: userId,
      rating: 5,
      comment: "Znakomita!"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.rating).toBe(5);
  });

  it('DELETE /api/reviews/:id - powinno usunąć recenzję', async () => {
    const insert = await query(`INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (${productId}, ${userId}, 3, 'Ok') RETURNING id;`);
    const res = await request(app).delete(`/api/reviews/${insert.rows[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/usunięta/);
  });

  it('GET /api/reviews/product/:productId - powinno zwrócić recenzje dla produktu', async () => {
    await query(`INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (${productId}, ${userId}, 4, 'Dobry produkt')`);
    const res = await request(app).get(`/api/reviews/product/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].comment).toBe('Dobry produkt');
  });
});
