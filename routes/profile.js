const express = require('express');

const router = express.Router();
const multer = require('multer');
const jimp = require('jimp');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Adventure = require('../models/adventure.model');

const uploadImage = multer({ dest: './public/img/avatar' });

// Отрисовка формы создания приключения
router
  .route('/create')
  .get(async (req, res) => {
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
  })
  // Создание нового приключения
  .post(async (req, res) => {
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

// Раздел "Созданные путешествия"
router.get('/created', async (req, res) => {
  if (req.session.username) {
    let adventures;
    try {
      const user = await User.findOne({ username: req.session.username });

      if (user.verified === true) {
        adventures = await Adventure.find({
          creator: req.session.userId,
        });

        return res.render('cards/cards', { layout: false, adventures });
      }

      if (user.verified === false) {
        return res.render('registration/unverified');
      }
    } catch (error) {
      return res.render('error', { layout: false });
    }
    return res.render('cards/cards', { layout: false, adventures });
  }

  return res.render('error');
});

// Карточка путешествия в разделе "Мои путешествия"
router.get('/category/card/:id', async (req, res) => {
  if (req.session.username) {
    let owner = false;
    const adventure = await Adventure.findById(req.params.id).populate(
      'creator'
    );

    if (adventure.creator.username === req.session.username) {
      owner = true;
    }

    const routePlanItems = adventure.routePlan;
    res.render('cards/adventureCard', { adventure, routePlanItems, owner });
  }
});

// Планирование приключения
router.get('/myadventures/plan/:id', async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { username: req.session.username },
      { $push: { plannedTrips: req.params.id } }
    );

    return res.json({ status: 'ok' });
  } catch (error) {
    return res.json({ status: 'false' });
  }
});

// Отмена планирования приключения
router.get('/myadventures/unplan/:id', async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { username: req.session.username },
      { $pull: { plannedTrips: req.params.id } }
    );

    return res.json({ status: 'ok' });
  } catch (error) {
    return res.json({ status: 'false' });
  }
});

// Старт приключения
router.get('/myadventures/start/:id', async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { username: req.session.username },
      { $push: { takenTrips: req.params.id } }
    );

    await User.findOneAndUpdate(
      { username: req.session.username },
      { $pull: { plannedTrips: req.params.id } }
    );

    return res.json({ status: 'ok' });
  } catch (error) {
    return res.json({ status: 'false' });
  }
});

// Стоп приключения
router.get('/myadventures/stop/:id', async (req, res) => {
  await User.findOneAndUpdate(
    { username: req.session.username },
    { $pull: { takenTrips: req.params.id } }
  );

  res.json({ status: 'ok' });
});

// Раздел активных приключений
router.get('/myadventures', async (req, res) => {
  const user = await User.findOne({ username: req.session.username });
  const adventures = [];

  // const adventures1 = await Promise.all(
  //   user.takenAdventures.map((el) => Adventure.findById(el))
  // );

  if (user.takenTrips.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const elem of user.takenTrips) {
      // eslint-disable-next-line no-await-in-loop
      const adventure = await Adventure.findById(elem);
      adventures.push(adventure);
    }
  } else {
    return res.render('users/emptySection', { layout: false });
  }

  return res.render('cards/cardsmain', { layout: false, adventures });
});

// Раздел запланированных путешествий
router.get('/myadventures/planned', async (req, res) => {
  const user = await User.findOne({ username: req.session.username });
  const adventures = [];

  // const adventures1 = await Promise.all(
  //   user.takenAdventures.map((el) => Adventure.findById(el))
  // );

  if (user.plannedTrips.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const elem of user.plannedTrips) {
      // eslint-disable-next-line no-await-in-loop
      const adventure = await Adventure.findById(elem);
      adventures.push(adventure);
    }
  } else {
    const planned = true;
    return res.render('users/emptySection', { layout: false, planned });
  }

  return res.render('cards/cardsmain', { layout: false, adventures });
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
