const express = require("express");
const {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
} = require("../controllers/productController.js");
const upload = require("../middleware/multer.js");
const adminAuth = require("../middleware/adminAuth.js");

const productRouter = express.Router();

productRouter.post(
  "/",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.delete("/:id", adminAuth, removeProduct);
productRouter.get("/:id", singleProduct);
productRouter.get("/", listProducts);

module.exports = productRouter;
