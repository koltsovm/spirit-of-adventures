const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const user = req.session.username;
  res.render('index', { user });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
