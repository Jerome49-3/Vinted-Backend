const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const uid2 = require("uid2");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const moment = require("moment/moment.js");
const CryptoJS = require("crypto-js");
// const bcrypt = require('bcrypt');
// const saltRounds = 16;

router.post("/signup", fileUpload(), async (req, res) => {
  // res.status(200).json({ message: "je suis sur la route /signup" });
  const { password, username, email, newsletter } = req.body;
  // console.log(
  //   "password in signup:",
  //   password,
  //   "\n",
  //   "username in signup:",
  //   username,
  //   "\n",
  //   "email in signup:",
  //   email,
  //   "\n",
  //   "newsletter in signup:",
  //   newsletter
  // );
  //si le champ username est vide, renvoyer un status Http400
  if (username.length === 0) {
    return res
      .status(400)
      .json({ message: "un champ du formulaire est manquant" });
  }
  //si le mot de passe est differend d'undefined
  if (password !== undefined && email !== undefined) {
    const userfindWithEmail = await User.findOne({ email: email });
    // console.log("userfindWithEmail in signup:", userfindWithEmail);
    if (userfindWithEmail) {
      return res
        .status(400)
        .json({ message: "email already exist: please login" });
    } else {
      try {
        // si password est egale à confirmPassword
        if (password) {
          //génerer le salt hash, token
          const salt = uid2(16);
          // console.log("salt in signup:", salt);
          const hash = SHA256(password + salt).toString(encBase64);
          // console.log("hash in signup:", hash);
          // const hash = await bcrypt.hash(password, 16);
          // console.log("hash in signup:", hash);
          const token = uid2(64);
          // console.log('token:', token)
          // si le hash, token different de null
          const date = moment().format("DD MMM YYYY");
          console.log("date in /users:", date);
          if (hash && token !== null) {
            if (req.body !== undefined) {
              const newUser = new User({
                email: email,
                account: {
                  username: username,
                },
                newsletter: newsletter,
                token: token,
                hash: hash,
                salt: salt,
                date: date,
              });
              console.log("newUser in signup:", newUser);
              await newUser.save();
              const userObj = {
                _id: newUser.id,
                token: newUser.token,
                account: newUser.account,
                isAdmin: newUser.isAdmin,
              };
              // console.log("userObj:", userObj);
              const userObjCrypt = CryptoJS.AES.encrypt(
                JSON.stringify(userObj),
                process.env.SRV_KEY_SECRET
              ).toString();
              // console.log("userObjCrypt:", userObjCrypt);
              return res.status(200).json(userObjCrypt);
            }
          } else {
            return res
              .status(400)
              .json({ message: "les mots de passe ne correspondent pas" });
          }
        }
      } catch (error) {
        console.log(error);
        console.log(error.message);
        console.log(error.status);
      }
    }
  }
});

module.exports = router;
