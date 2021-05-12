const { Schema, model } = require('mongoose');

const User = new Schema({
  name: String,
  lastName: String,
  username: String,
  email: String,
  city: String,
  avatar: String,
  password: String,
  verified: Boolean,
  plannedTrips: [{ type: Schema.Types.ObjectId, ref: 'Adventure' }],
  takenTrips: [{ type: Schema.Types.ObjectId, ref: 'Adventure' }],
  createdTrips: [{ type: Schema.Types.ObjectId, ref: 'Adventure' }],
});

module.exports = model('User', User);
