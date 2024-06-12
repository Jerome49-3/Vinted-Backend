const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Offer = require("../../models/Offer.js");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const isFileToUpload = require("../../middleware/isFileToUpload.js");
const fileUpload = require("express-fileupload");
const convertToBase64 = require("../../utils/convertToBase64.js");
router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  isFileToUpload,
  async (req, res) => {
    console.log("je suis sur  la route /offer/publish");
    // console.log("req.body:", req); **** Verification des clé crée dans req
    try {
      const { title, description, price, condition, city, brand, size, color } =
        req.body;
      if (req.body !== undefined) {
        const resultOneFile = req.uploadOneFile;
        // console.log("resultOneFile on offerRoutes:", resultOneFile);
        const resultMultiFile = req.uploadMultiFile;
        // console.log("resultMultiFile on offerRoutes:", resultMultiFile);
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
            { EMPLACEMENT: city },
          ],
          owner: req.user,
          product_image: resultOneFile,
          product_pictures: resultMultiFile,
        });
        // console.log("newOffer before Save:", newOffer);
        await newOffer.save();
        console.log("newOffer after Save:", newOffer);
        // console.log("newOffer after Save:", newOffer);
        return res.status(200).json({ newOffer, message: "produit crée" });
      } else {
        res.status(400).json({ message: "aucune valeur dans les champs" });
      }
    } catch (error) {
      console.log(error);
      console.log(error.status);
      return res.status(500).json({ message: error.message });
    }
  }
);
module.exports = router;
