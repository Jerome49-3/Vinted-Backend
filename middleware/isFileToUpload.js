const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const convertToBase64 = require("../utils/convertToBase64");

const isFileToUpload = async (req, res, next) => {
  if (req.files !== null || req.files.pictures.length !== 0) {
    const picUpload = req.files.pictures;
    // console.log("picturesToUpload:", picUpload);
    const arrayOfPromises = picUpload.map((picture) => {
      return cloudinary.uploader.upload(convertToBase64(picture));
    });
    const result = await Promise.all(arrayOfPromises);
    // console.log("resultBeforIf:", result);
    if (result) {
      // console.log("resultAfterif:", result);
      req.uploadResult = result;
      return  next()
    }
  } else {
    return res.status(400).json({ message: "bad request" });
  }
};
module.exports = isFileToUpload;
