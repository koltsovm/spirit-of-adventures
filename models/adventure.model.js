const { Schema, model } = require('mongoose');

const Adventure = new Schema({
  title: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  category: String,
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  description: String,
  routePlan: [Array],
  coordinates: [Array],
  photos: String,
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = model('Adventure', Adventure);
