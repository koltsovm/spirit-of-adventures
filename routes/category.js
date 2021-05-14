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

  res.render('cards/cardsmain', { adventures });
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
      console.log('adventure======>>>>>>', adventure);
    } catch (error) {
      return res.render('error');
    }
    return res.render('cards/adventureCard', { layout: false, adventure, owner });
  });

module.exports = router;
