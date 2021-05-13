const { Schema, model } = require('mongoose');

const Adventure = new Schema({
  title: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  category: String,
  description: String,
  routePlan: [String], // TODO указать тип элемента
  coordinates: [String],
  photos: String,
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = model('Adventure', Adventure);
