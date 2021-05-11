const mongoose = require('mongoose');

const Category = new mongoose.Schema({
  categoryName: String, // TODO убрать название из поля
  categoryImage: String,
});

module.exports = mongoose.model('Category', Category);
