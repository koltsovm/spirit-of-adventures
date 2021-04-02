const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

router.get('/:title', async (req, res) => {
  console.log(req.params.title);
  const adventures = await Adventure.find({ category: req.params.title });
  adventures.forEach(async (el) => {
    const user = await User.findById(el.creator);
    el.creator = user.username;
  });
  console.log(adventures);
  res.render('cards/cardsmain', { adventures });
});

module.exports = router;
