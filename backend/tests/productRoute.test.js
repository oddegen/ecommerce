import request from 'supertest';
import app from '../server.js';

describe('Product Routes', () => {
  it('should list all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('should get a single product', async () => {
    const productId = 'validProductId'; // Replace with a valid product ID
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toBeDefined();
  });
});