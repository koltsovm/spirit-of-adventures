const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

router.get('/create', async (req, res) => {
  const categories = await Category.find();
  res.render('users/create', { layout: false, categories });
});

router.get('/created', async (req, res) => {
  if (req.session.username) {
    let adventures;
    try {
      adventures = await Adventure.find({
        creator: req.session.userId,
      });
    } catch (error) {
      return res.render('error');
    }
    return res.render('cards/cards', { layout: false, adventures });
  }

  return res.render('error');
});

router.post('/create', (req, res) => {
  res.render('users/routeCreated', { layout: false });
});

router.get('/:username', async (req, res) => {
  if (req.session.username) {
    let user;
    try {
      user = await User.find({ _id: req.session.userId });
    } catch (error) {
      return res.render('error');
    }
    return res.render('users/profile', { user });
  }

  return res.render('error');
});

module.exports = router;
