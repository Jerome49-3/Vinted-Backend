// require('dotenv').config();
// const cloudinary = require('cloudinary').v2;

// const fileUploadPreset = async (req, res, next) => {
//   if (!req.file.image) {
//     return res.status(403).json({ message: "file manquant" })
//   } else {
//     try {
      // cloudinary.api.create_upload_preset({
      //   name: 'vintedOffer',
      //   tags: 'nolife, rienasec, passtempsinutile',
      //   folder: 'vinted/offers',
      //   allowed_formats: 'jpg, png, webp, jpeg, gif'
      // })
//         .then(uploadResult => console.log(uploadResult))
//         .catch(error => console.error(error));
//     } catch (error) {
//       console.log('error:', '\n', error, '\n', 'error.status:', error.status, '\n', 'error.message:', error.message);
//     }
//   }
// }
// const auth = req.headers.authorization.replace("Bearer ", "");
// if (auth) {
//   // console.log('authMiddleware:', auth);
//   // console.log('auth', auth)
//   //chercher l'user par le token
//   const user = await User.findOne({
//     token: auth.replace("Bearer", "")
//   });
//   //si pas d'user
//   if (!user) {
//     return res.status(401).json({ error: "Unathorized" });
//   } else {
//     req.user = user;
//     // console.log('req.userMiddleware:', req.user);
//     return next();
//   }
// }