const request = require("supertest");
const app = require("../app.js");
const mongoose = require("mongoose");

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || "";
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Product API Integration Tests", () => {
  it("should list all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it("should return 404 for non-existent product", async () => {
    const res = await request(app).get(
      "/api/products/612345678901234567890123"
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Product not found/);
  });
});
