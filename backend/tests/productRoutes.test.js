const request = require("supertest");
const express = require("express");

// Mock productModel
jest.mock("../models/productModel.js");
const productModel = require("../models/productModel.js");
const findMock = jest.fn();
const findByIdMock = jest.fn();
const findByIdAndDeleteMock = jest.fn();
const saveMock = jest.fn();
productModel.find = findMock;
productModel.findById = findByIdMock;
productModel.findByIdAndDelete = findByIdAndDeleteMock;
productModel.mockImplementation((data) => ({ save: saveMock }));

// Mock cloudinary
jest.mock("cloudinary", () => ({
  v2: {
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: "secure_url" }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));

// Mock multer upload middleware with fields function
jest.mock("../middleware/multer.js", () => ({
  fields: jest.fn(() => (req, res, next) => {
    req.files = {
      image1: [{ path: "p1" }],
      image2: [],
      image3: [],
      image4: [],
    };
    next();
  }),
}));
// Mock adminAuth
jest.mock("../middleware/adminAuth.js", () => (req, res, next) => next());

const productRouter = require("../routes/productRoute.js");
const app = express();
app.use(express.json());
app.use("/products", productRouter);

describe("Product routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("POST /products - addProduct", async () => {
    saveMock.mockResolvedValue();
    const res = await request(app)
      .post("/products")
      .field("name", "Prod")
      .field("description", "Desc")
      .field("price", "10")
      .field("category", "Cat")
      .field("subCategory", "Sub")
      .field("sizes", JSON.stringify(["S", "M"]))
      .field("bestseller", "true");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Product added successfully",
    });
    expect(saveMock).toHaveBeenCalled();
    expect(require("cloudinary").v2.uploader.upload).toHaveBeenCalledWith(
      "p1",
      { resource_type: "image" }
    );
  });

  test("GET /products - listProducts", async () => {
    const products = [{ id: "1" }];
    findMock.mockResolvedValue(products);
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, products });
    expect(findMock).toHaveBeenCalledWith({});
  });

  test("GET /products/:id - singleProduct exists", async () => {
    const prod = { id: "1" };
    findByIdMock.mockResolvedValue(prod);
    const res = await request(app).get("/products/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, product: prod });
    expect(findByIdMock).toHaveBeenCalledWith("1");
  });

  test("GET /products/:id - singleProduct not found", async () => {
    findByIdMock.mockResolvedValue(null);
    const res = await request(app).get("/products/2");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: false, message: "Product not found" });
  });

  test("DELETE /products/:id - removeProduct", async () => {
    const prod = {
      id: "1",
      image: ["http://res.cloudinary.com/v2/uploader/upload/id.jpg"],
    };
    findByIdMock.mockResolvedValue(prod);
    findByIdAndDeleteMock.mockResolvedValue();
    const res = await request(app).delete("/products/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Product deleted successfully",
    });
    expect(findByIdMock).toHaveBeenCalledWith("1");
    expect(require("cloudinary").v2.uploader.destroy).toHaveBeenCalled();
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith("1");
  });

  test("DELETE /products/:id - product not found", async () => {
    findByIdMock.mockResolvedValue(null);
    const res = await request(app).delete("/products/3");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: false, message: "Product not found" });
  });
});
