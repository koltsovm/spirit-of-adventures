const mongoose = require('mongoose');

const Category = new mongoose.Schema({
  categoryName: String,
  categoryImage: String,
});

module.exports = mongoose.model('Category', Category);
