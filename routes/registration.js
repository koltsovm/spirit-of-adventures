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

        req.session.username = user.username;
        req.session.userId = user.id;

        await transporter.sendMail({
          from: process.env.EMAIL_LOGIN,
          to: email,
          subject: 'Подтверждение электронной почты',
          text: 'Подтвердите электронную почту',
          html: `<table style="border: hidden;">
                  <tr style="background-color: blue;">
                    <td style="text-align: center; color: white"><h1>Дух приключений</h1><br></td>
                  </tr>
                  <tr>
                    <td style="text-align: center;">
                      <p>Добро пожаловать на портал "Дух приключений!"</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        Вы получили это письмо потому что данный почтовый ящик был указан при регистрации на портале.<br>
                        Для подтверждения регистрации нажмите на кнопку ниже. Если это были не вы, просто проигнорируйте это письмо<br>
                      </p>
                    </td>
                    </tr>
                  <tr>
                    <td style="text-align: center;">
                      <b><a href="http://localhost:3000/registration/verification/${user.id}"><h2>Подтвердить электронную почту</h2></a></b>
                    </td>
                  </tr>
                  <tr style="background-color: blue;">
                    <td style="text-align: center; color: white"><p>С уважением, команда "Духа приключений".</p></td>
                  </tr>
                </table>`,
        });

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

// Repeated verification
router.get('/repeat', async (req, res) => {
  const user = await User.findOne({ username: req.session.username });

  await transporter.sendMail({
    from: process.env.EMAIL_LOGIN,
    to: user.email,
    subject: 'Повторное письмо для подтверждения электронной почты',
    text: 'Подтвердите электронную почту',
    html: `<table style="border: hidden;">
            <tr style="background-color: blue;">
              <td style="text-align: center; color: white"><h1>Дух приключений</h1><br></td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <p>Добро пожаловать на портал "Дух приключений!"</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>
                  Вы получили это письмо потому что данный почтовый ящик был указан при регистрации на портале.<br>
                  Для подтверждения регистрации нажмите на кнопку ниже. Если это были не вы, просто проигнорируйте это письмо<br>
                </p>
              </td>
              </tr>
            <tr>
              <td style="text-align: center;">
                <b><a href="http://localhost:3000/registration/verification/${user.id}"><h2>Подтвердить электронную почту</h2></a></b>
              </td>
            </tr>
            <tr style="background-color: blue;">
              <td style="text-align: center; color: white"><p>С уважением, команда "Духа приключений".</p></td>
            </tr>
          </table>`,
  });

  res.render('registration/emailSent');
});

module.exports = router;
