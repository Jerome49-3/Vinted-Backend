const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const uid2 = require('uid2');
const { SHA256 } = require('crypto-js');
const encBase64 = require('crypto-js/enc-base64');
// const bcrypt = require('bcrypt');

// const saltRounds = 16;

router.post('/user/signUp', async (req, res) => {
  const {
    password,
    username,
    email,
  } = req.body
  //si le champ username est vide, renvoyer un status Http400
  if (username.length === 0) {
    return res.status(400).json({ message: "un champ du formulaire est manquant" })
  }
  //si le mot de passe est differend d'undefined
  if (password !== undefined && email !== undefined) {
    findEmail = await User.findOne({ email: email })
    if (findEmail) {
      return res.status(400).json({ message: "email already exist: please login" })
    } else {
      try {
        // si password est egale à confirmPassword
        if (password) {
          //génerer le salt hash, token
          const salt = uid2(16);
          console.log('salt:', salt)
          const hash = SHA256(password + salt).toString(encBase64);
          console.log('hashSalt', hashSalt)
          // const hash = await bcrypt.hash(password, 16);
          console.log('hash', hash)
          const token = uid2(20);
          // console.log('token:', token)
          // si le hash, token different de null
          if (hash && token !== null) {
            const newUser = new User({
              email: email,
              account: {
                username: username
              },
              token: token,
              hash: hash,
              salt: salt
            })
            console.log('newUser:', newUser)
            await newUser.save()
            res.status(201).json({ newUser, message: 'user created' })
          }
        }
        else {
          return res.status(400).json({ message: "les mots de passe ne correspondent pas" })
        }

      } catch (error) {
        console.log(error.message)
        console.log(error.status)
      }
    }

  }
})

module.exports = router;