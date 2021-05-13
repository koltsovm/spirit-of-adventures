const { Schema, model } = require('mongoose');

const Tag = new Schema({
  title: String,
});

module.exports = model('Tag', Tag);
