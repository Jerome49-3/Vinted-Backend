const mongoose = require('mongoose')

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true
  },
  account: {
    username: {
      type: String,
      required: true
    },
    avatar: Object, // nous verrons plus tard comment uploader une image
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;