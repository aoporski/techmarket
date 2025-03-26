const request = require('supertest');
const app = require('../../app');
const { query } = require('../../config/dbTest');
const Basket = require('../../models/basketModel');


describe('Basket API', () => {
    beforeAll(async () => {
        await query(`
            CREATE TABLE IF NOT EXISTS basket (
                id SERIAL PRIMARY KEY,
                user_id INT,
                product_id INT,
                quantity INT
            );
        `);
    });
    afterAll(async () => {
        await query(`DROP TABLE IF EXISTS basket;`);
    });
    // beforeEach(async () => {
    //     await query(`TRUNCATE TABLE basket RESTART IDENTITY CASCADE;`);
    // });
    beforeEach(async () => {
        await Basket.destroy({ where: {}, truncate: true, restartIdentity: true });
      });

    it('POST /api/basket - should add product to basket', async () => {
        const res = await request(app).post('/api/basket').send({
            user_id: 1,
            product_id: 1,
            quantity: 2
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.user_id).toBe(1);
        expect(res.body.product_id).toBe(1);
        expect(res.body.quantity).toBe(2);
    });

    it('GET /api/basket/:user_id - should return basket for user', async () => {
        await Basket.create({ user_id: 1, product_id: 1, quantity: 2 });
        await Basket.create({ user_id: 1, product_id: 2, quantity: 3 });

        const res = await request(app).get('/api/basket/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
    });    

    it('PUT /api/basket/:user_id/:product_id - should update quantity of product in basket', async () => {
        await Basket.create({ user_id: 1, product_id: 1, quantity: 2 });

        const res = await request(app).put('/api/basket/1/1').send({ quantity: 5 });
        expect(res.statusCode).toBe(200);
        expect(res.body.quantity).toBe(5);
    }   );

    it('DELETE /api/basket/:user_id/:product_id - should remove product from basket', async () => {
        await Basket.create({ user_id: 1, product_id: 1, quantity: 2 });
        const res = await request(app).delete('/api/basket/1/1');
        expect(res.statusCode).toBe(204);
    }
    );

    it('DELETE /api/basket/:user_id/:product_id - should return 404 if product not found', async () => {
        const res = await request(app).delete('/api/basket/1/1');
        expect(res.statusCode).toBe(404);
    });


    it('POST /api/basket - should return 400 if quantity is less than 1', async () => {
        const res = await request(app).post('/api/basket').send({
            user_id: 1,
            product_id: 1,
            quantity: 0
        });
        expect(res.statusCode).toBe(400);
    }
    );  

    it('PUT /api/basket/:user_id/:product_id - should return 400 if quantity is less than 1', async () => {
        const res = await request(app).put('/api/basket/1/1').send({ quantity: 0 });
        expect(res.statusCode).toBe(400);
    }); 

});
