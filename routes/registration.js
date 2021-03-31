const express = require('express');

const router = express.Router();
const User = require('../models/user.model');

router.get('/form', (req, res) => {
  res.render('registration/regForm');
});

router.post('/form', async (req, res) => {
  const existingUser = await User.find({ email: req.body.email });

  if (!existingUser.length) {
    try {
      const user = await User.create({
        name: req.body.name,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        city: req.body.city,
        avatar: req.body.avatar,
        password: req.body.password,
      });

      req.session.username = user.username;
      req.session.userId = user.id;

      return res.render('index', { layout: false, user });
    } catch (error) {
      console.log(error);
      return res.render('error');
    }
  } else {
    return res.render('registration/error', { layout: false, status: 'false' });
  }
});

module.exports = router;
