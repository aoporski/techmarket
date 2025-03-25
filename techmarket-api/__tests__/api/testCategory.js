const request = require('supertest');
const app = require('../../app');
const { query } = require('../../config/dbTest');

describe('Categories API', () => {
  beforeAll(async () => {
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);
  });

  beforeEach(async () => {
    await query(`TRUNCATE TABLE categories RESTART IDENTITY CASCADE;`);
  });

  afterAll(async () => {
    await query(`DROP TABLE IF EXISTS categories;`);
  });

  it('GET /api/categories - powinno zwrócić pustą listę', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/categories - powinno dodać kategorię', async () => {
    const res = await request(app).post('/api/categories').send({
      name: "Laptopy",
      description: "Dział laptopów"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Laptopy");
  });

  it('GET /api/categories/:id - powinno zwrócić kategorię po ID', async () => {
    const insert = await query(`INSERT INTO categories (name, description) VALUES ('Laptopy', 'desc') RETURNING id;`);
    console.log(insert.rows[0].id);

    const res = await request(app).get(`/api/categories/${insert.rows[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Laptopy");
  });

  it('PUT /api/categories/:id - powinno zaktualizować kategorię', async () => {
    const insert = await query(`INSERT INTO categories (name, description) VALUES ('Laptopy', 'desc') RETURNING id;`);

    const res = await request(app).put(`/api/categories/${insert.rows[0].id}`).send({
      name: "Smartfony",
      description: "Dział smartfonów"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Smartfony");
  });

  it('DELETE /api/categories/:id - powinno usunąć kategorię', async () => {
    const insert = await query(`INSERT INTO categories (name, description) VALUES ('Laptopy', 'desc') RETURNING id;`);

    const res = await request(app).delete(`/api/categories/${insert.rows[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/usunięta/);
  });
});