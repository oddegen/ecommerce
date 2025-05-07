import request from 'supertest';
import app from '../server.js';

describe('User Routes', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/api/user/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should login a user', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should login an admin', async () => {
    const res = await request(app).post('/api/user/admin').send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});