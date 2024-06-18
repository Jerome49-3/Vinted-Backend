require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);
const cloudinary = require("cloudinary").v2;
const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);
//**** npx nodemon index.js ****//
//routes
const signUpRoutes = require("./routes/auth/signUp.routes");
const logInRoutes = require("./routes/auth/logIn.routes");
const offerPost = require("./routes/offer/offerPost.routes");
const offerGet = require("./routes/offer/offerGet.routes");
// const offerPutDel = require("./routes/offer/offerPutDel.routes");

//appel des routes
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
