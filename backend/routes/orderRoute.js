const express = require("express");
const {
  allOrders,
  placeOrder,
  updateStatus,
  userOrders,
} = require("../controllers/orderContoller.js");
const adminAuth = require("../middleware/adminAuth.js");
const authUser = require("../middleware/auth.js");

const orderRouter = express.Router();

orderRouter.get("/", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

orderRouter.post("/place", authUser, placeOrder);

orderRouter.get("/user", authUser, userOrders);

module.exports = orderRouter;
