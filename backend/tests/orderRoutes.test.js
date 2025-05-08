const request = require("supertest");
const express = require("express");

// Replace orderModel mock with simpler approach
jest.mock("../models/orderModel.js");
const orderModel = require("../models/orderModel.js");
const saveMock = jest.fn();
const findMock = jest.fn();
const findByIdAndUpdateMock = jest.fn();
orderModel.mockImplementation(() => ({ save: saveMock }));
orderModel.find = findMock;
orderModel.findByIdAndUpdate = findByIdAndUpdateMock;

// Replace userModel mock
jest.mock("../models/userModel.js");
const userModel = require("../models/userModel.js");
const userFindByIdAndUpdateMock = jest.fn();
userModel.findByIdAndUpdate = userFindByIdAndUpdateMock;

// Mock middleware
jest.mock("../middleware/auth.js", () =>
  jest.fn((req, res, next) => {
    req.userId = "user1";
    next();
  })
);
jest.mock("../middleware/adminAuth.js", () =>
  jest.fn((req, res, next) => {
    req.userId = "admin1";
    next();
  })
);

const orderRouter = require("../routes/orderRoute.js");

const app = express();
app.use(express.json());
app.use("/orders", orderRouter);

describe("Order routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /orders - allOrders", async () => {
    const fakeOrders = [{ id: 1 }, { id: 2 }];
    findMock.mockResolvedValue(fakeOrders);
    const res = await request(app).get("/orders");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, orders: fakeOrders });
    expect(findMock).toHaveBeenCalledWith({});
  });

  test("POST /orders/status - updateStatus", async () => {
    findByIdAndUpdateMock.mockResolvedValue({});
    const res = await request(app)
      .post("/orders/status")
      .send({ orderId: "123", status: "shipped" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "status updated" });
    expect(findByIdAndUpdateMock).toHaveBeenCalledWith("123", {
      status: "shipped",
    });
  });

  test("POST /orders/place - placeOrder", async () => {
    saveMock.mockResolvedValue();
    const res = await request(app)
      .post("/orders/place")
      .send({ items: [1], amount: 100, address: "123 St" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "order placed" });
    expect(saveMock).toHaveBeenCalled();
    expect(userFindByIdAndUpdateMock).toHaveBeenCalledWith("user1", {
      cartData: {},
    });
  });

  test("GET /orders/user - userOrders", async () => {
    const userOrders = [{ id: "a" }];
    findMock.mockResolvedValue(userOrders);
    const res = await request(app).get("/orders/user");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, orders: userOrders });
    expect(findMock).toHaveBeenCalledWith({ userId: "user1" });
  });
});
