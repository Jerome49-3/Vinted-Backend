const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Offer = require("../../models/Offer");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const isFileToUpload = require("../../middleware/isFileToUpload.js");
const fileUpload = require("express-fileupload");

router.put(
  "/offer/:id",
  isAuthenticated,
  fileUpload(),
  isFileToUpload,
  async (req, res) => {
    console.log("je suis sur la route PUT /offer/:id");
    //faire une recherche par l'id de l'offre
    const findOfferByID = Offer.findById(req.params.id);
    const resultOneFile = req.uploadOneFile;
    const resultMultiFile = req.uploadMultiFile;
    // si l'id est valide
    if (mongoose.Types.ObjectId.isValid(findOfferByID)) {
      console.log("findOfferByID", findOfferByID);
      //si l'id de l'offre est trouvé on vérifie si l'user à modifié l'image:
      // si req.uploadOneFile(resultOneFile).public_id est differend de findOfferByID.product_image.public_id
      if (resultOneFile.public_id !== findOfferByID.product_image.public_id) {
      }

      res.status(200).json({ findOfferByID });
      if (req.body) {
        const {
          title,
          description,
          price,
          condition,
          city,
          brand,
          size,
          color,
        } = req.body;
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
        await newOffer.save();
        return res.status(200).json({ newOffer });
      }
    }
  }
);

router.delete("/offer/:id", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route PUT /offer/:id");
  try {
    if (mongoose.Types.ObjectId.isValid(findOfferByID)) {
      await Offer.findByIdAndDelete(req.params.id);
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
  res.status(200).json({ message: "le médoc à été supprimé" });
});

module.exports = router;
