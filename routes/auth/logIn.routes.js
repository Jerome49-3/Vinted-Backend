const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");

router.post("/login", async (req, res) => {
  res.status(200).json({ message: "je suis sur la route /login" });
  try {
    //destructurer req.body
    const { password, email } = req.body;
    //si password et email n'est pas undefined
    if (password !== undefined && email !== undefined) {
      // trouver l'user avec son email
      const user = await User.findOne({ email: email });
      // console.log('user:', user);
      //decrypter le hash
      // if (!user) {
      //   res.status(400).json({ message: "email or password are wrong" });
      // }
      if (user) {
        const pwdHash = SHA256(password + user.salt).toString(encBase64);
        // const match = await bcrypt.compare(password, user.hash);
        if (pwdHash === user.hash) {
          // console.log('matchOk')
          // console.log('user:', user);
          res.status(200).json({
            _id: user.id,
            token: user.token,
            account: user.account,
            message: "login succesfully",
          });
        } else {
          res.status(401).json({ message: "Unanthorized" });
        }
      } else {
        res.status(401).json({ message: "Unanthorized" });
      }
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.log(error.message);
    console.log(error.status);
  }
});

module.exports = router;
