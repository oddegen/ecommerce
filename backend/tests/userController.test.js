const {
  loginUser,
  registerUser,
  adminLogin,
} = require("../controllers/userController.js");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

jest.mock("../models/userModel.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("validator");

describe("userController", () => {
  let req, res, mockJson, mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    res = { json: mockJson, status: mockStatus };
    req = { body: {} };
    jest.clearAllMocks();
  });

  describe("loginUser", () => {
    it("should return success and token when credentials are valid", async () => {
      req.body = { email: "test@example.com", password: "password" };
      const mockUser = { _id: "123", password: "hashed" };
      userModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token123");

      await loginUser(req, res);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashed");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "123" },
        process.env.JWT_SECRET
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        token: "token123",
      });
    });

    it("should return error when user not found", async () => {
      req.body = { email: "test@example.com", password: "password" };
      userModel.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should return error when password does not match", async () => {
      req.body = { email: "test@example.com", password: "password" };
      const mockUser = { _id: "123", password: "hashed" };
      userModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);

      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });
  });

  describe("registerUser", () => {
    it("should return error if user exists", async () => {
      req.body = {
        name: "Test",
        email: "test@example.com",
        password: "password",
      };
      userModel.findOne.mockResolvedValue({});

      await registerUser(req, res);

      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "User already exists",
      });
    });

    it("should return error for invalid email", async () => {
      req.body = { name: "Test", email: "bademail", password: "password" };
      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(false);

      await registerUser(req, res);

      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email",
      });
    });

    it("should return error for short password", async () => {
      req.body = { name: "Test", email: "test@example.com", password: "short" };
      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(true);

      await registerUser(req, res);

      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Password must be at least 8 characters",
      });
    });

    it("should create user and return token", async () => {
      req.body = {
        name: "Test",
        email: "test@example.com",
        password: "password",
      };
      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(true);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      const saveMock = jest.fn().mockResolvedValue({ _id: "123" });
      userModel.mockImplementation(() => ({ save: saveMock }));
      jwt.sign.mockReturnValue("token123");

      await registerUser(req, res);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("password", "salt");
      expect(saveMock).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "123" },
        process.env.JWT_SECRET
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        token: "token123",
      });
    });
  });

  describe("adminLogin", () => {
    it("should return token for valid admin", async () => {
      req.body = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      };
      jwt.sign.mockReturnValue("admintoken");

      await adminLogin(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD,
        process.env.JWT_SECRET
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        token: "admintoken",
      });
    });

    it("should return error for invalid credentials", async () => {
      req.body = { email: "wrong", password: "wrong" };

      await adminLogin(req, res);

      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });
  });
});
