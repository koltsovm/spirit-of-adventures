const { Schema, model } = require('mongoose');

const Category = new Schema({
  title: String,
  image: String,
});

module.exports = model('Category', Category);
