const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const CryptoJS = require("crypto-js");

router.post("/login", fileUpload(), async (req, res) => {
  // return res.status(200).json({ message: "je suis sur la route /login" });
  try {
    const { password, email } = req.body;
    if (password !== undefined && email !== undefined) {
      const user = await User.findOne({ email: email });
      if (user === undefined) {
        return res.status(400).json({ message: "Bad request " });
      } else {
        // console.log("user:", user);
        const pwdHash = SHA256(password + user.salt).toString(encBase64);
        if (pwdHash === user.hash) {
          const userObj = {
            _id: user.id,
            token: user.token,
            account: user.account,
            isAdmin: user.isAdmin,
          };
          // console.log("userObj:", userObj);
          const userObjCrypt = CryptoJS.AES.encrypt(
            JSON.stringify(userObj),
            process.env.SRV_KEY_SECRET
          ).toString();
          // console.log("userObjCrypt:", userObjCrypt);
          return res.status(200).json(userObjCrypt);
        }
      }
    }
  } catch (error) {
    console.log("error in catch:", error);
    return res.status(400).json({ message: "somethings went wrong" });
  }
});

module.exports = router;
