const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: String,
  lastName: String,
  username: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('User', User);
