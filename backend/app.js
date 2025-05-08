const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDb = require("./config/mongodb.js");
const connectCloudinary = require("./config/cloudinary.js");
const userRouter = require("./routes/userRoute.js");
const productRouter = require("./routes/productRoute.js");
const cartRouter = require("./routes/cartRoute.js");
const orderRouter = require("./routes/orderRoute.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
