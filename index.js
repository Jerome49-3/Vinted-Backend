require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);
const cloudinary = require("cloudinary").v2;
const stripe = require("stripe")(
  "sk_test_51PSyHURpe0ngd0zS9aV14bS07pYbc3RNQksobgldvwiG9s7x74zmvJi9llrgnB9LQ9nx7TIMahoSbPni6gj4uI2E00tXyVqW09"
);
//**** npx nodemon index.js ****//

const signUpRoutes = require("./routes/auth/signUp.routes");
const logInRoutes = require("./routes/auth/logIn.routes");
const offerPost = require("./routes/offer/offerPost.routes");
const offerGet = require("./routes/offer/offerGet.routes");
// const offerPutDel = require("./routes/offer/offerPutDel.routes");
app.use(cors());
app.use("/user", signUpRoutes);
app.use("/user", logInRoutes);
app.use(offerPost);
app.use(offerGet);
// app.use(offerPutDel);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome" });
});

app.all("*", (req, res) => {
  console.log("all routes");
  res.status(404).json({ message: "All routes" });
});
app.listen(process.env.PORT, () => {
  console.log("server started:" + "", process.env.PORT);
});
