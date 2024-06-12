const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../utils/convertToBase64");

const isFileToUpload = async (req, res, next) => {
  // const options = {
  //   use_filename: true,
  //   unique_filename: false,
  //   overwrite: true,
  // };
  try {
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
        //**** on convertit le buffer (données en language binaire, temporaire pour être utilisé) de l'image en base64 pour etre compris par cloudinary ****//
        const result = await cloudinary.uploader.upload(
          convertToBase64(pictureToUpload)
        );
        // console.log("resultnotPromise:", result);
        //**** je stocke les données de la conversion en base64 du buffer de l'image dans req ****//
        req.uploadOneFile = result;
        // console.log("coucouIFResult:", req.uploadOneFile);
        //**** on quitte le middleware et passe à la suite du code ****//
        return next();
        //**** si arrayPictures est un tableau ****//
      } else if (arrayPictures === true) {
        // console.log(
        //   "req.files.pictures after else if:",
        //   "\n",
        //   req.files.pictures
        // );
        //**** je stocke req.files.pictures dans une constante ****//
        const picUpload = req.files.pictures;
        // console.log("picUpload:", picUpload);
        //**** pour chaque image convertir en base64 et envoyer les envoyer les images à cloudinary ****//
        const arrayOfPromises = picUpload.map((picture) => {
          // console.log("picture:", picture);
          return cloudinary.uploader.upload(convertToBase64(picture));
        });
        //**** attendre le fin de l'upload pour tous les fichiers et les stocker dans une constante ****//
        const result = await Promise.all(arrayOfPromises);
        // console.log("resultPromise:", result);
        //**** stocker les informations des images dans req ****//
        req.uploadMultiFile = result;
        //console.log("coucouIFResult:", req.uploadMultiFile);
        //**** on quitte le middleware et passe à la suite du code ****//
        return next();
      }
    }
    //**** si req.files.pîctures est null ou 0, on retourne une erreur 400 bad request ****//
    else {
      return res.status(400).json({ result, message: "bad request" });
    }
  } catch (error) {
    //**** si le try echoue (erreur server), on retourne une erreur ****//
    console.log("error.message:", "\n", error.message);
  }
};
module.exports = isFileToUpload;
