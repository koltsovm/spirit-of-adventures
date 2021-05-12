const express = require('express');

const router = express.Router();
const User = require('../models/user.model');
const transporter = require('../emailConfig');

router
  .route('/form')
  .get((req, res) => {
    res.render('registration/regForm');
  })
  .post(async (req, res) => {
    const { name, lastName, username, email, city, avatar, password } =
      req.body;
    const existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser) {
      try {
        const user = await User.create({
          // {... req.body}
          name,
          lastName,
          username,
          email,
          city,
          avatar,
          password,
          verified: false,
        });

        await transporter.sendMail({
          from: process.env.EMAIL_LOGIN,
          to: email,
          subject: 'Подтверждение электронной почты',
          text: 'Подтвердите электронную почту',
          html: `<h1>Дух приключений</h1><br><p>Добро пожаловать на портал "Дух приключений!"<br> Вы получили это письмо потому что данный почтовый ящик был указан при регистрации на портале.<br>Для подтверждения регистрации нажмите на кнопку ниже. Если это были не вы, просто проигнорируйте это письмо<br><a href="http://localhost:3000/registration/verification/${user.id}">Подтвердить электронную почту</a> С уважением, команда "Духа приключений".</p>`,
        });

        req.session.username = user.username;
        req.session.userId = user.id;

        return res.render('index', { layout: false, user });
      } catch (error) {
        console.log(error);
        return res.render('error');
      }
    } else {
      return res.render('registration/error', {
        layout: false,
        status: 'false',
      });
    }
  });

// Email verification
router.get('/verification/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { verified: true });
  res.render('registration/verified');
});

module.exports = router;
