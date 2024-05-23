require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/vinted');
const cloudinary = require("cloudinary").v2;


const signUpRoutes = require('./routes/signUp.routes');
const logInRoutes = require('./routes/logIn.routes');
const offerPublish = require('./routes/offerPublish.routes');
const getOffers = require('./routes/getOffers.routes');

app.use(signUpRoutes);
app.use(logInRoutes);
app.use(offerPublish);
app.use(getOffers);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome' });
});

app.all("*", (req, res) => {
  console.log("server started");
  res.status(404).json({ message: "All routes" });
})
app.listen(3000, () => {
  console.log("server started");
})