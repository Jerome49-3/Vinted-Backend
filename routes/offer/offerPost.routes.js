const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Offer = require('../../models/Offer.js')
const isAuthenticated = require('../../middleware/isAuthenticated.js');
const fileUpload = require('express-fileupload');
const convertToBase64 = require('../../utils/convertToBase64.js');
const cloudinary = require("cloudinary").v2;

router.post('/offer/publish', isAuthenticated, fileUpload(), async (req, res) => {
  // console.log('req.body:', req.body)
  try {
    const {
      title,
      description,
      price,
      condition,
      city,
      brand,
      size,
      color
    } = req.body;
    if (req.files !== null || req.files.pictures.length !== 0) {
      const picUpload = req.files.pictures;
      console.log('picturesToUpload:', picUpload);
      const arrayOfPromises = picUpload.map((picture) => {
        return cloudinary.uploader.upload(convertToBase64(picture));
      });
      const result = await Promise.all(arrayOfPromises);
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "bad request" })
    }
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
        product_image: result
      });
      // newOffer.product_image.folder='Home/vinted/offers';
      // console.log('folderimage:', newOffer.product_image.folder)
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