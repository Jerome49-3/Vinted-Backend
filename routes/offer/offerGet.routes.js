const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Offer = require("../../models/Offer");
const User = require("../../models/User");

router.get("/offers", async (req, res) => {
  console.log("je suis sur la route /offers");
  const { title, priceMin, priceMax, sort, page } = req.query;
  // console.log(
  //   "req.query.title:",
  //   req.query.title,
  //   "\n",
  //   "req.query.priceMin:",
  //   req.query.priceMin,
  //   "\n",
  //   "req.query.priceMax:",
  //   req.query.priceMax,
  //   "\n",
  //   "req.query.sort:",
  //   req.query.sort
  // );

  let filter = {};
  let select = "";
  let skipNum = 0;
  let filterSort = {};
  let limitNum = 0;

  try {
    if (
      req.query.title &&
      req.query.priceMin &&
      req.query.priceMax &&
      req.query.sort !== undefined
    ) {
      select = "product_name product_price -_id";
      // console.log('page:', page)
      if (title !== undefined) {
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
      // console.log(
      //   "skipPage",
      //   skipPage,
      //   "skipNum:",
      //   skipNum,
      //   "limitNum:",
      //   limitNum
      // );
      const offers = await Offer.find(filter)
        .sort(filterSort)
        .limit(limitNum)
        .skip(skipNum)
        .select(select);
      if (offers) {
        const userId = offers.owner;
        // console.log("userId in /offers/:id:", userId);
        const ownerFind = await User.findById(userId).select("account");
        // console.log("ownerFind after findbyid in /offers/:id:", ownerFind);
      }
      return res.status(200).json({
        offers: {
          product_name: offers.product_name,
          product_description: offers.product_description,
          product_price: offers.product_price,
          product_details: offers.product_details,
          product_image: offers.product_image,
          product_pictures: offers.product_pictures,
          owner: ownerFind,
        },
      });
    } else {
      // console.log("ok");
      const newOffers = await Offer.find();
      // console.log("offers in /offers/:id:", offers);
      let offers = [];
      // const getOffer = await Offer.find().select("product_name product_price -_id");
      // console.log("newOffers in /offers/:id:", newOffers);
      for (let i = 0; i < newOffers.length; i++) {
        const el = newOffers[i];
        // console.log("el:", el);
        const userId = el.owner;
        // console.log("userId in /offers/:id:", userId);
        // console.log("typeof userId in /offers/:id:", typeof userId);
        // const userIdIsValid = mongoose.isValidObjectId(userId);
        // console.log("userIdIsValid in /offers/:id:", userIdIsValid);
        const ownerFind = await User.findById(userId).select("account");
        // console.log("ownerFind in for in /offers/:id:", ownerFind);
        offers.push({
          _id: el._id,
          product_name: el.product_name,
          product_description: el.product_name,
          product_price: el.product_price,
          product_details: el.product_details,
          product_image: el.product_image,
          product_pictures: el.product_pictures,
          owner: ownerFind,
        });
      }
      // console.log("offers in /offers/:id:", offers);
      return res.status(200).json(offers);
    }
  } catch (error) {
    console.log("error:", error, "\n", "error.message:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/offers/:id", async (req, res) => {
  console.log("je suis sur la route /offers/:id");
  const offerId = req.params.id;
  // console.log("offerId in /offers/:id", offerId);

  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  // console.log("offerIdIsValid in /offers/:id:", offerIdIsValid);
  if (offerId !== undefined && offerIdIsValid !== false) {
    try {
      const offer = await Offer.findById(offerId);
      // console.log("offerId after findbyid in /offers/:id:", offerId);
      // console.log("offer in /offers/:id:", offer);
      if (offer) {
        let detailsObj = {};
        const userId = offer.owner;
        // console.log("userId in /offers/:id:", userId);
        const ownerFind = await User.findById(userId).select("account");
        // console.log("ownerFind after findbyid in /offers/:id:", ownerFind);
        const offerDetails = offer.product_details;
        // console.log("offerDetails:", offerDetails);
        // for (let i = 0; i < offerDetails.length; i++) {
        //   const el = offerDetails[i];
        //   // console.log("el:", el);
        //   const marque = el.MARQUE;
        //   // console.log("marque:", marque);
        //   const taille = el.TAILLE;
        //   // console.log("taille:", taille);
        //   const etat = el.ÉTAT;
        //   // console.log("etat:", etat);
        //   const couleur = el.COULEUR;
        //   // console.log("couleur:", couleur);
        //   const emplacement = el.EMPLACEMENT;
        //   // console.log("emplacement:", emplacement);
        // }
        return res.status(200).json({
          product_name: offer.product_name,
          product_description: offer.product_name,
          product_price: offer.product_price,
          product_details: offer.product_details,
          product_image: offer.product_image,
          product_pictures: offer.product_pictures,
          product_id: offer._id,
          owner: ownerFind,
        });
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
