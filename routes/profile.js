const express = require('express');

const router = express.Router();
const multer = require('multer');
const jimp = require('jimp');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

const uploadImage = multer({ dest: './public/img/avatar' });

router.get('/create', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.username });

    if (user.verified === true) {
      const categories = await Category.find();
      return res.render('users/create', { layout: false, categories });
    }

    if (user.verified === false) {
      return res.render('registration/unverified');
    }
  } catch (error) {
    return res.render('error');
  }
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

// Создание нового приключения
router.post('/create', async (req, res) => {
  const { title, category, description, routePlan, coordinates } = req.body;
  try {
    await Adventure.create({
      title,
      creator: req.session.userId,
      category,
      description,
      routePlan,
      coordinates,
      photos: req.body.photos,
    });
  } catch (error) {
    return res.render('error');
  }
  return res.render('users/routeCreated', { layout: false });
});

router.get('/category/card/:id', async (req, res) => {
  if (req.session.username) {
    const adventure = await Adventure.findById(req.params.id).populate('creator');

    const routePlanItems = adventure.routePlan;
    res.render('cards/adventureCard', { adventure, routePlanItems });
  }
});

// Личный кабинет
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

// Avatar upload
router.post('/', uploadImage.single('avatarFile'), async (req, res) => {
  if (req.file) {
    jimp.read(`${req.file.destination}/${req.file.filename}`).then((image) => {
      image
        .resize(100, 100)
        .quality(70)
        .write(`./public/img/previews/${req.file.filename}`);
    });

    await User.findOneAndUpdate(
      { username: req.session.username },
      { avatar: req.file.filename }
    );

    return res.json({ image: `${req.file.filename}` });
  }
  return res.json({ image: `${req.file.filename}` });
});

module.exports = router;
