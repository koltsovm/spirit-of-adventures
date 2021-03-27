const mongoose = require('mongoose');

const Adventure = new mongoose.Schema({
  title: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  description: String,
  routePlan: String,
  coordinates: String,
  photos: String,
});

module.exports = mongoose.model('adventure', Adventure);
