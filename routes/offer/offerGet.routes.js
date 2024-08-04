const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Offer = require("../../models/Offer");

router.get("/offers", async (req, res) => {
  console.log("je suis sur la route /offers");
  const { title, priceMin, priceMax, sort, page } = req.query;
  let filter = {};
  let select = "";
  let skipNum = 0;
  let filterSort = {};
  try {
    if (req.query !== undefined) {
      const offers = await Offer.find();
      // const getOffer = await Offer.find().select("product_name product_price -_id");
      res.status(200).json({ offers, message: "getofferok" });
    } else {
      select = "product_name product_price -_id";
      // console.log('page:', page)
      if (title) {
        filter.product_name = new RegExp(title, "i");
      }
      if (priceMin !== undefined) {
        filter.product_price = { $gte: priceMin };
      }
      if (priceMax !== undefined) {
        filter.product_price = { $lte: priceMax };
      }
      if (sort === "price-desc") {
        filterSort.product_price = -1;
        console.log("price-desc:", filterSort);
      }
      if (sort === "price-asc") {
        filterSort.product_price = 1;
        console.log("price-asc:", filterSort);
      }
      //si page est différend de undefined et strictement supérieur à 0
      if (page !== undefined || page !== 0) {
        let limitNum = 3;
        skipPage = page - 1;
        skipNum = skipPage * limitNum;
      }
      console.log(
        "skipPage",
        skipPage,
        "skipNum:",
        skipNum,
        "limitNum:",
        limitNum
      );
      const offers = await Offer.find(filter)
        .sort(filterSort)
        .limit(limitNum)
        .skip(skipNum)
        .select(select);
      return res.status(200).json({ offers, message: "getofferok" });
    }
  } catch (error) {
    console.log(
      "error:",
      error,
      "\n",
      "error.message:",
      error.message,
      "\n",
      "error.message:",
      error.message
    );
    return res.status(500).json({ error: error.message });
  }
});

router.get("/offers/:id", async (req, res) => {
  console.log("je suis sur la route /offers/:id");
  const offerId = req.params.id;
  console.log("offerId in /offers/:id", offerId);

  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  console.log("offerIdIsValid in /offers/:id:", offerIdIsValid);
  if (offerId !== undefined && offerIdIsValid !== false) {
    try {
      const offer = await Offer.findById(offerId);
      console.log("offerId after findbyid in /offers/:id:", offerId);
      console.log("offer in /offers/:id:", offer);
      if (offer) {
        return res
          .status(200)
          .json({ offer, message: "voila l'article souhaité" });
      }
    } catch (error) {
      console.log("error:", error, "\n", "error.message:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ message: "bad request" });
  }
});

module.exports = router;
