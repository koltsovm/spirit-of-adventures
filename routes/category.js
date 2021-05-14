const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

// Страница путешествия
router.get('/card/:id', async (req, res) => {
  let owner = false;
  let taken = false;
  let planned = false;
  let unknown = true;

  const adventure = await Adventure.findById(req.params.id).populate(
    'creator'
  );

  const routePlanItems = adventure.routePlan;

  if (req.session.username) {
    const user = await User.findOne({ username: req.session.username });

    if (user.takenTrips.includes(req.params.id)) {
      taken = true;
      unknown = false;
    }

    if (user.plannedTrips.includes(req.params.id)) {
      planned = true;
      unknown = false;
    }


    if (req.session.username === adventure.creator.username) {
      owner = true;
    }

    return res.render('cards/adventureCard', {
      adventure,
      routePlanItems,
      owner,
      taken,
      planned,
      unknown,
    });
  }

  return res.render('cards/adventureCard', {
    adventure,
    routePlanItems,
    owner,
    taken,
    planned,
    unknown: false,
  });
});

router.get('/:title', async (req, res) => {
  const adventures = await Adventure.find({ category: req.params.title });

  res.render('cards/cardsmain', { adventures });
});

// Страница рандомного путешествия
router.get('/adventure/random', async (req, res) => {
  let taken = false;
  let planned = false;
  let unknown = true;

  const user = await User.findOne({ username: req.session.username });

  if (user.takenTrips.includes(req.params.id)) {
    taken = true;
    unknown = false;
  }

  if (user.plannedTrips.includes(req.params.id)) {
    planned = true;
    unknown = false;
  }
  const adventures = await Adventure.find();
  const adventure = adventures[Math.floor(Math.random() * adventures.length)];
  res.render('cards/adventureCard', { adventure, taken, planned, unknown });
});

// Страница редактирования
router
  .route('/owner/:id')
  .get(async (req, res) => {
    const adventure = await Adventure.findById(req.params.id);
    const categories = [];
    const allCategories = await Category.find();
    allCategories.forEach((el) => {
      if (el.title !== adventure.category) {
        categories.push(el);
      }
    });
    res.render('cards/editForm', { adventure, categories });
  })
  .put(async (req, res) => {
    const { title, category, description, routePlan } = req.body;
    let adventure;
    const owner = true;
    let taken = false;
    let planned = false;
    let unknown = true;

    const user = await User.findOne({ username: req.session.username });

    if (user.takenTrips.includes(req.params.id)) {
      taken = true;
      unknown = false;
    }

    if (user.plannedTrips.includes(req.params.id)) {
      planned = true;
      unknown = false;
    }

    try {
      await Adventure.findOneAndUpdate(
        { _id: req.params.id },
        {
          title,
          category,
          description,
          routePlan,
        }
      );

      adventure = await Adventure.findById(req.params.id);
    } catch (error) {
      return res.render('error');
    }
    return res.render('cards/adventureCard', {
      layout: false,
      adventure,
      owner,
      taken,
      planned,
      unknown,
    });
  });

module.exports = router;
