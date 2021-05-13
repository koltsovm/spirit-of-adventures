const { Schema, model } = require('mongoose');

const Category = new Schema({
  categoryName: String, // TODO убрать название из поля
  categoryImage: String,
});

module.exports = model('Category', Category);
