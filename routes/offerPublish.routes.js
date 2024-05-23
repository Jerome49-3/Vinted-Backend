const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Offer = require('../models/Offer.js')
const isAuthenticated = require('../middleware/isAuthenticated');
const fileUpload = require('express-fileupload');
const convertToBase64 = require('../utils/convertToBase64.js')

router.use(isAuthenticated);


router.post('/offer/publish', fileUpload(), async (req, res) => {
  // console.log('req.body:', req.body)
  try {
    console.log(req.body);
    console.log(req.files);
    const {
      title,
      description,
      price,
      condition,
      city,
      brand,
      size,
      color,
      picture
    } = req.body;

    if (req.body !== undefined) {
      // console.log('req.user.id:', req.user.id, 'req.user.account.username', req.user.account.username)
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ÉTAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city }
        ],
        owner: req.user,
        product_image: {}
      });
      await newOffer.save()
      console.log('newOffer:', newOffer)
      res.status(200).json({ newOffer, message: "produit crée" })
    } else {
      res.status(400).json({ message: "aucune valeur dans les champs" })
    }
  } catch (error) {
    console.log(error);
    console.log(error.status);
    return res.status(500).json({ message: error.message })
  }

})

module.exports = router;