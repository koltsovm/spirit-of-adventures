const express = require('express');

const router = express.Router();
const User = require('../models/user.model');

router.get('/:username', async (req, res) => {
  if (req.session.username) {
    try {
      const currentUser = await User.find({ username: req.params.username });
      // console.log('SIC!');
    } catch (error) {
      return res.render('error');
    }

    const user = req.session.username;

    return res.render('users/profile', { user });
  }
});

module.exports = router;
