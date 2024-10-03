const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");

router.get("/mypurchases", isAuthenticated, async (req, res) => {
  res.status(201).json({ message: "je suis sur la route /mypurchases" });
});

module.exports = router;
