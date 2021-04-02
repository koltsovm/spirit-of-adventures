const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

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

router.get('category/:id', async (req, res) => {
  console.log('HERE1');
  const adventures = await Adventure.findById(req.params.id);
  adventures.forEach(async (el) => {
    const user = await User.findById(el.creator);
    el.creator = user.username;
  });
  res.render('cards/cardsmain', { adventures });
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

// Удаление записи. Почему-то не работает в роутере /profile
router.delete('/delete/:id', async (req, res) => {
  try {
    const thisAdventure = await Adventure.findOne({ _id: req.params.id });
    if (req.session.userId.toString() === thisAdventure.creator.toString()) {
      await Adventure.findByIdAndDelete(req.params.id);
    } else {
      return res.json({
        isDeleteSuccessful: false,
        errorMessage: 'У вас нет прав для этого действия :(',
      });
    }
  } catch (error) {
    return res.json({
      isDeleteSuccessful: false,
      errorMessage: 'Не удалось удалить запись из базы данных.',
    });
  }

  return res.json({ isDeleteSuccessful: true });
});

module.exports = router;
