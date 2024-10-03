const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const Transactions = require("../../models/Transactions.js");

router.get("/mysales", isAuthenticated, async (req, res) => {
  // res.status(201).json({ message: "je suis sur la route /mysales" });
  console.log("je suis sur la route /mysales");
  const id = req.params.id;
  console.log("id on /mysales:", id);
  const offerSolded = Transactions.find({ "seller._id": id });
});

module.exports = router;
