const app = require("./app.js");
const connectDb = require("./config/mongodb.js");
const connectCloudinary = require("./config/cloudinary.js");

// establish DB and Cloudinary connections
connectDb();
connectCloudinary();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
