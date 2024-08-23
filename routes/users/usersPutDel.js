// const express = require("express");
// const mongoose = require("mongoose");
// const router = express.Router();
// const User = require("../../models/User");
// const isAuthenticated = require("../../middleware/isAuthenticated.js");
// const isFileToUpload = require("../../middleware/isFileToUpload.js");
// const fileUpload = require("express-fileupload");

// router.put(
//   "/users/:id",
//   isAuthenticated,
//   fileUpload(),
//   isFileToUpload,
//   async (req, res) => {
//     console.log("je suis sur la route PUT /users/:id");
//     //faire une recherche par l'id de l'offre
//     const findUserByID = User.findById(req.params.id);
//     console.log("findUserByID", findUserByID);
//     const resultOneFile = req.uploadOneFile;
//     const resultMultiFile = req.uploadMultiFile;
//     //**** si l'id est valide ****//
//     if (mongoose.Types.ObjectId.isValid(findUserByID)) {
//       res.status(200).json({ findUserByID });
//       if (req.body) {
// const { username, email, newsletter, isAdmin } = req.body;
// const newUser = new User({
//   email: email,
//   account: {
//     username: username,
//   },
//   newsletter: newsletter,
// });
//         await newUser.save();
//         return res.status(200).json(newUser);
//       }
//     }
//   }
// );

// router.delete("/users/:id", isAuthenticated, fileUpload(), async (req, res) => {
//   console.log("je suis sur la route delete /users/:id");
//     const findUserByID = User.findById(req.params.id);
//     console.log("findUserByID", findUserByID);
//   try {
//     if (mongoose.Types.ObjectId.isValid(findUserByID)) {
//       await User.findByIdAndDelete(req.params.id);
//     } else {
//       res.status(400).json({ message: "Bad request" });
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
//   res.status(200).json({ message: "l'user à été supprimé" });
// });

// module.exports = router;
