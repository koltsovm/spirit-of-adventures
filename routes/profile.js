const express = require('express');

const router = express.Router();
const User = require('../models/user.model');

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
