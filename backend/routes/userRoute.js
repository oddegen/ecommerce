const express = require("express");
const {
  adminLogin,
  loginUser,
  registerUser,
} = require("../controllers/userController.js");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

module.exports = userRouter;
