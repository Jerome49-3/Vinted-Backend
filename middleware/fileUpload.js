const User = require('../models/User');

const fileUpload = async (req, res, next) => {
  // console.log('req.headers.authorizationMiddleware:', req.headers.authorization);
  //si headers token d'authorization
  if (!req.file) {
    return res.status(403).json({ message: "file manquant" })
  } else {

  }
}
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