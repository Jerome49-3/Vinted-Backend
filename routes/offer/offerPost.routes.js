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
    // console.log(req.body);
    const picture = req.files;
    console.log('picture:', picture);
    const dataPicture = await cloudinary.uploader.upload(
      convertToBase64(req.files.image), {
      upload_preset: 'vinted_preset',
    }
);
    console.log('dataPicture:', dataPicture);
    // console.log(dataPicture);
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
        product_image: dataPicture
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