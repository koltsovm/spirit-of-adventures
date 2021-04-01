const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const Category = require('../models/category.model');

router.get('/', (req, res) => {
  const user = req.session.username;
  res.render('index', { user });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/main', async (req, res) => {
  const categories = await Category.find();
  res.render('cards/main', { layout: false, categories });
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      req.session.username = user.username;
      req.session.userId = user.id;
    } else {
      return res.send({ status: 'fail' });
    }
  } catch (error) {
    return res.send('error');
  }

  return res.send({ status: 'ok' });
});

module.exports = router;