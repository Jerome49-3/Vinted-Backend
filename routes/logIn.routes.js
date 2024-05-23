const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
// const bcrypt = require('bcrypt');
const { SHA256 } = require('crypto-js');
const encBase64 = require('crypto-js/enc-base64');

router.get('/user/login', async (req, res) => {
  try {
    //destructurer req.body
    const {
      password,
      email,
    } = req.body
    //si password et email n'est pas undefined
    if (password !== undefined && email !== undefined) {
      // trouver l'user avec son email
      const user = await User.findOne({ email: email });
      // console.log('user:', user);
      //decrypter le hash
      if (!user) {
        return res.status(400).json({ message: "email or password are wrong" })
      }
      const pwdHash = SHA256(password + user.salt).toString(encBase64)
      // const match = await bcrypt.compare(password, user.hash);
      if (pwdHash === user.hash) {
        // console.log('matchOk')
        // console.log('user:', user);
        res.status(200).json({ _id: user.id, token: user.token, account: user.account, message: "login succesfully" })
      }
      else {
        res.status(400).json({ message: "email or password are wrong: try again" })
      }
    }
  } catch (error) {
    console.log(error)
    console.log(error.status)
  }
})

module.exports = router;