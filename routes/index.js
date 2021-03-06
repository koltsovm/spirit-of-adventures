const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

router.get('/', (req, res) => {
  const user = req.session.username;
  res.render('index', { user });
});

// Поиск по сайту
router.post('/find', async (req, res) => {
  console.log(req.body.title);
  // const result = await Adventure.find({
  //   title: new RegExp('/' + req.body.title + '/i'),
  // });
  // console.log(result);
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

// Страничка about
router.get('/about', (req, res) => {
  res.render('about');
});

// Удаление записи. Почему-то не работает в роутере /profile
// Потому что надо проверять адреса в роутерах!
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
