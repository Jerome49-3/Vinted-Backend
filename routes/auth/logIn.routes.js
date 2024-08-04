const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");

router.post("/login", fileUpload(), async (req, res) => {
  // return res.status(200).json({ message: "je suis sur la route /login" });
  try {
    const { password, email } = req.body;
    if (password !== undefined && email !== undefined) {
      const user = await User.findOne({ email: email });
      if (user === undefined) {
        return res.status(400).json({ message: "Bad request " });
      } else {
        const pwdHash = SHA256(password + user.salt).toString(encBase64);
        if (pwdHash === user.hash) {
          // console.log('user:', user);
          return res.status(200).json({
            _id: user.id,
            token: user.token,
            account: user.account,
            message: "login succesfully",
          });
        }
      }
    }
  } catch (error) {
    console.log("error in catch:", error);
    return res.status(400).json({ message: "somethings went wrong" });
  }
});

module.exports = router;
