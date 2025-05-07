import request from 'supertest';
import app from '../server.js';

describe('Cart Routes', () => {
  it('should get user cart', async () => {
    const res = await request(app).get('/api/cart').set('token', 'validUserToken'); // Replace with a valid token
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cartData).toBeDefined();
  });

  it('should add an item to the cart', async () => {
    const res = await request(app).post('/api/cart').set('token', 'validUserToken').send({
      itemId: 'validItemId',
      size: 'M',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Item added to cart');
  });
});