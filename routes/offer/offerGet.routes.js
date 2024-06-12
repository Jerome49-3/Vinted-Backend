const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Offer = require("../../models/Offer");

router.get("/offer", async (req, res) => {
  console.log("je suis sur la route /offers");
  const { title, priceMin, priceMax, sort, page } = req.query;
  let filter = {};
  let select = "";
  let skipNum = 0;
  let filterSort = {};
  try {
    if (req.query !== undefined) {
      const getOffer = await Offer.find().select(
        "product_name product_price -_id"
      );
      // const getOffer = await Offer.find().select("product_name product_price -_id");
      res.status(200).json({ getOffer, message: "getofferok" });
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
      const getOffer = await Offer.find(filter)
        .sort(filterSort)
        .limit(limitNum)
        .skip(skipNum)
        .select(select);
      return res.status(200).json({ getOffer, message: "getofferok" });
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

router.get("/offer/:id", async (req, res) => {
  console.log("je suis sur la route /offers/:id");
  const offerId = req.params.id;
  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  console.log("offerIdIsValid:", offerIdIsValid);
  if (offerId !== undefined && offerIdIsValid !== false) {
    try {
      const offerObj = await Offer.findById(offerId);
      // console.log('offerId:', offerId)
      console.log("offerId:", offerObj);
      if (offerObj) {
        return res
          .status(200)
          .json({ offerObj, message: "voila l'article souhaité" });
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
  } else {
    return res.status(400).json({ message: "bad request" });
  }
});

module.exports = router;
