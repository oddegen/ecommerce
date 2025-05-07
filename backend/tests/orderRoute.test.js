import request from 'supertest';
import app from '../server.js';

describe('Order Routes', () => {
  it('should place an order', async () => {
    const res = await request(app).post('/api/orders/place').set('token', 'validUserToken').send({
      items: [{ itemId: 'validItemId', quantity: 1 }],
      amount: 100,
      address: { street: '123 Test St', city: 'Test City', zip: '12345' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('order placed');
  });

  it('should get user orders', async () => {
    const res = await request(app).get('/api/orders/user').set('token', 'validUserToken');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.orders)).toBe(true);
  });
});