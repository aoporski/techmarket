const request = require('supertest');
const app = require('../../app');
const { query } = require('../../config/db');

describe('Users API', () => {
  beforeAll(async () => {
    try {
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
    } catch (error) {
      console.error('Error creating table:', error);
    }
  });

  beforeEach(async () => {
    try {
      await query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
    } catch (error) {
      console.error('Error truncating table:', error);
    }
  });

  afterAll(async () => {
    try {
      await query(`DROP TABLE IF EXISTS users;`);
    } catch (error) {
      console.error('Error dropping table:', error);
    }
  });

  it('GET /api/users - powinno zwrócić pustą listę', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/users - powinno dodać użytkownika', async () => {
    const res = await request(app).post('/api/users').send({
      username: "johndoe",
      email: "john@example.com",
      password_hash: "hashedpassword",
      first_name: "John",
      last_name: "Doe"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("johndoe");
  });

  it('GET /api/users - powinno zwrócić listę użytkowników', async () => {
    await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('janedoe', 'jane@example.com', 'hash', 'Jane', 'Doe')`);
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /api/users/:id - powinno zwrócić użytkownika po ID', async () => {
    const insert = await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('johndoe', 'john@example.com', 'hash', 'John', 'Doe') RETURNING id;`);
    const res = await request(app).get(`/api/users/${insert.rows[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("john@example.com");
  });

  it('PUT /api/users/:id - powinno zaktualizować użytkownika', async () => {
    const insert = await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('johndoe', 'john@example.com', 'hash', 'John', 'Doe') RETURNING id;`);
    const res = await request(app).put(`/api/users/${insert.rows[0].id}`).send({
      username: "johnupdated",
      email: "john@updated.com",
      passwordHash: "hash",
      first_name: "Johnny",
      last_name: "Updated"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("johnupdated");
  });

  it('DELETE /api/users/:id - powinno usunąć użytkownika', async () => {
    const insert = await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('johndoe', 'john@example.com', 'hash', 'John', 'Doe') RETURNING id;`);
    const res = await request(app).delete(`/api/users/${insert.rows[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/usunięty/);
  });
});
// const request = require('supertest');
// const app = require('../../app');
// // const { query } = process.env.NODE_ENV === 'test'
// //   ? require('../../config/dbTest')
// //   : require('../../config/db');
// const { query } = require('../../config/dbTest');

// describe('Users API', () => {
//   beforeAll(async () => {
//     await query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         username VARCHAR(100) NOT NULL,
//         email VARCHAR(255) NOT NULL,
//         password_hash TEXT NOT NULL,
//         first_name VARCHAR(100),
//         last_name VARCHAR(100)
//       );
//     `);
//   });

//   beforeEach(async () => {
//     await query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
//   });

//   afterAll(async () => {
//     await query(`DROP TABLE IF EXISTS users;`);
//   });

//   it('GET /api/users - powinno zwrócić pustą listę', async () => {
//     const res = await request(app).get('/api/users');
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual([]);
//   });

//   it('POST /api/users - powinno dodać użytkownika', async () => {
//     const res = await request(app).post('/api/users').send({
//       username: "johndoe",
//       email: "john@example.com",
//       password_hash: "hashedpassword",
//       firstName: "John",
//       lastName: "Doe"
//     });
//     expect(res.statusCode).toBe(201);
//     expect(res.body.username).toBe("johndoe");
//   });

//   it('GET /api/users - powinno zwrócić listę użytkowników', async () => {
//     await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('janedoe', 'jane@example.com', 'hash', 'Jane', 'Doe')`);
//     const res = await request(app).get('/api/users');
//     expect(res.statusCode).toBe(200);
//     expect(res.body.length).toBe(1);
//   });

//   it('GET /api/users/:id - powinno zwrócić użytkownika po ID', async () => {
//     const insert = await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('johndoe', 'john@example.com', 'hash', 'John', 'Doe') RETURNING id;`);
//     const res = await request(app).get(`/api/users/${insert.rows[0].id}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.email).toBe("john@example.com");
//   });

//   it('PUT /api/users/:id - powinno zaktualizować użytkownika', async () => {
//     const insert = await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('johndoe', 'john@example.com', 'hash', 'John', 'Doe') RETURNING id;`);
//     const res = await request(app).put(`/api/users/${insert.rows[0].id}`).send({
//       username: "johnupdated",
//       email: "john@updated.com",
//       firstName: "Johnny",
//       lastName: "Updated"
//     });
//     expect(res.statusCode).toBe(200);
//     expect(res.body.username).toBe("johnupdated");
//   });

//   it('DELETE /api/users/:id - powinno usunąć użytkownika', async () => {
//     const insert = await query(`INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ('johndoe', 'john@example.com', 'hash', 'John', 'Doe') RETURNING id;`);
//     const res = await request(app).delete(`/api/users/${insert.rows[0].id}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toMatch(/usunięty/);
//   });
// });
