const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Offer = require('../models/Offer')

router.get('/offers', async (req, res) => {
  console.log('je suis sur la route /offers')
  const getOffer = await Offer.find();
  return res.status(200).json({ getOffer, message: "getofferok" })
  // const {
  //   title,
  //   priceMin,
  //   priceMax,
  //   page
  // } = req.query
})

router.get('/offers/:id', async (req, res) => {
  console.log('je suis sur la route /offers/:id')
  const offerId = req.params.id;
  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  console.log('offerIdIsValid:', offerIdIsValid)
  if (offerId !== undefined && offerIdIsValid !== false) {
    try {
      const offerObj = await Offer.findById(offerId);
      // console.log('offerId:', offerId)
      console.log('offerId:', offerObj)
      if (offerObj) {
        return res.status(200).json({ offerObj, message: "voila l'article souhaité" })
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
      console.log(error.status);
      return res.status(500).json({ error: error.message })
    }
  }
  else {
    return res.status(400).json({ message: "bad request" })
  }
})

module.exports = router