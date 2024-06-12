const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Offer = require("../../models/Offer.js");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const isFileToUpload = require("../../middleware/isFileToUpload.js");
const fileUpload = require("express-fileupload");
const convertToBase64 = require("../../utils/convertToBase64.js");
const cloudinary = require("cloudinary").v2;

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    console.log("je suis sur  la route /offer/publish");
    // console.log("req.body:", req); **** Verification des clé crée dans req
    try {
      const { title, description, price, condition, city, brand, size, color } =
        req.body;
      if (req.body !== undefined) {
        //**** si une image: je récupère l'image stocké dans req ****//
        const resultOneFile = req.uploadOneFile;
        // console.log("resultOneFile on offerRoutes:", resultOneFile);
        //**** si plusieurs images: je récupère les images stocké dans req ****//
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
        //**** verifier la précense de req.files.pîctures ****//
        // console.log("req.files.pictures before if:", "\n", req.files);
        //**** si req.files.pîctures est différent de null ou de 0 ****//
        if (req.files !== null || req.files.pictures !== 0) {
          //**** stocker req.files.pîctures ds une variable ****//
          const pictureToUpload = req.files.pictures;
          // console.log("pictureToUpload:", pictureToUpload);
          //**** stocker la vérification de pictureToUpload dans une variable const 'arrayPictures' pour savoir si c'est un tableau ****//
          const arrayPictures = Array.isArray(pictureToUpload);
          // console.log("arrayPictures:", arrayPictures);
          //**** si 'arrayPictures' n'est pas un tableau ****//
          if (arrayPictures === false) {
            console.log("req.picOneName:", req.picOneName);
            //**** on convertit le buffer (données en language binaire, temporaire pour être utilisé) de l'image en base64 pour etre compris par cloudinary ****//
            const result = await cloudinary.uploader.upload(
              convertToBase64(pictureToUpload),
              {
                folder: "vinted/offers/" + newOffer.id,
              }
            );
            // console.log("resultnotPromise:", result);
            //**** je stocke les données de la conversion en base64 du buffer de l'image dans req ****//
            req.uploadOneFile = result;
            // console.log("coucouIFResult:", req.uploadOneFile);
            //**** on quitte le middleware et passe à la suite du code ****//
          } else if (arrayPictures === true) {
            // console.log(
            //   "req.files.pictures after else if:",
            //   "\n",
            //   req.files.pictures
            // );
            //**** je stocke req.files.pictures dans une constante ****//
            const picUpload = req.files.pictures;
            console.log("picUpload:", picUpload);
            //**** pour chaque image convertir en base64 et envoyer les envoyer les images à cloudinary ****//
            console.log("newOffer.id before Save:", newOffer.id);
            const arrayOfPromises = picUpload.map((picture) => {
              // console.log("picture:", picture);
              return cloudinary.uploader.upload(convertToBase64(picture), {
                folder: "vinted/offers/" + newOffer.id,
              });
            });
            const result = await Promise.all(arrayOfPromises);
            //**** attendre le fin de l'upload pour tous les fichiers et les stocker dans une constante ****//
            console.log("resultPromise:", result);
            //**** stocker les informations des images dans req ****//
            req.uploadMultiFile = result;
            //console.log("coucouIFResult:", req.uploadMultiFile);
            //**** on quitte le middleware et passe à la suite du code ****//
          }
        }
        //**** si req.files.pîctures est null ou 0, on retourne une erreur 400 bad request ****//
        else {
          return res.status(400).json({ result, message: "bad request" });
        }
        await newOffer.save();
        // console.log("newOffer after Save:", newOffer);
        return res.status(200).json({ newOffer, message: "produit crée" });
      } else {
        res.status(400).json({ message: "bad request" });
      }
    } catch (error) {
      console.log(error);
      console.log(error.status);
      return res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
