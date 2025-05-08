const request = require('supertest');
const express = require('express');
const cartRouter = require('../routes/cartRoute');
const authUser = require('../middleware/auth');
const userModel = require('../models/userModel');

// Mock auth middleware to set req.userId
jest.mock('../middleware/auth', () => jest.fn((req, res, next) => { req.userId = 'testUserId'; next(); }));
// Mock userModel methods
jest.mock('../models/userModel');

const app = express();
app.use(express.json());
app.use('/api/cart', cartRouter);

describe('Cart API Endpoints', () => {
  beforeEach(() => {
    userModel.findById.mockClear();
    userModel.findByIdAndUpdate.mockClear();
  });

  describe('GET /api/cart', () => {
    it('should return user cart data', async () => {
      const fakeCart = { item1: { S: 2 } };
      userModel.findById.mockResolvedValue({ cartData: fakeCart });

      const res = await request(app).get('/api/cart');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, cartData: fakeCart });
    });
  });

  describe('POST /api/cart', () => {
    it('should add an item to the cart', async () => {
      const mockUser = { cartData: {} };
      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const res = await request(app)
        .post('/api/cart')
        .send({ itemId: 'item1', size: 'M' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: 'Item added to cart' });
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'testUserId',
        { cartData: { item1: { M: 1 } } }
      );
    });
  });

  describe('PUT /api/cart', () => {
    it('should update item quantity in cart', async () => {
      const mockUser = { cartData: { item1: { M: 1 } } };
      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const res = await request(app)
        .put('/api/cart')
        .send({ itemId: 'item1', size: 'M', quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: 'Cart updated successfully' });
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'testUserId',
        { cartData: { item1: { M: 5 } } }
      );
    });
  });
});
