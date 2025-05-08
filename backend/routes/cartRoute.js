const express = require("express");
const {
  addToCart,
  getUserCart,
  updateCart,
} = require("../controllers/cartController.js");
const authUser = require("../middleware/auth.js");

const cartRouter = express.Router();

cartRouter.get("/", authUser, getUserCart);
cartRouter.post("/", authUser, addToCart);
cartRouter.put("/", authUser, updateCart);

module.exports = cartRouter;
