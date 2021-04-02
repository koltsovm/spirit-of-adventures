const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

router.get('/card/:id', async (req, res) => {
  console.log('TADA!');
  const adventure = await Adventure.findById(req.params.id);
  res.render('cards/adventureCard', { adventure });
});

router.get('/:title', async (req, res) => {
  const adventures = await Adventure.find({ category: req.params.title });
  let user;
  if (req.session.username) {
    user = req.session.username;
  }
  res.render('cards/cardsmain', { adventures, user });
});

module.exports = router;
