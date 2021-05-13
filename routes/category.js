const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

// Страница путешествия
router.get('/card/:id', async (req, res) => {
  let owner = false;

  const adventure = await Adventure.findById(req.params.id).populate('creator');

  if (req.session.username === adventure.creator.username) {
    owner = true;
  }

  const routePlanItems = adventure.routePlan;
  res.render('cards/adventureCard', { adventure, routePlanItems, owner });
});

router.get('/:title', async (req, res) => {
  const adventures = await Adventure.find({ category: req.params.title });
  console.log('req.params.title', req.params.title);
  console.log(adventures);

  res.render('cards/cardsmain', { adventures });
});

module.exports = router;
