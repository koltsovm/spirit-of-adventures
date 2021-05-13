require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const createError = require('http-errors');
const path = require('path');
const MongoStore = require('connect-mongo');
const hbs = require('hbs');
const dbConnect = require('./db/db');

const mongoUrl = process.env.DATABASE_STRING;

// Import routers
const indexRouter = require('./routes/index');
const registrationRouter = require('./routes/registration');
const profileRouter = require('./routes/profile');
const categoryRouter = require('./routes/category');

const app = express();

dbConnect();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

// Connect session
app.use(
  session({
    secret: 'show me your favorite route',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // maxAge: 60000
    store: MongoStore.create({ mongoUrl }),
  }),
);

// Send user to all HBS
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

// Routers
app.use('/', indexRouter);
app.use('/registration', registrationRouter);
app.use('/profile', profileRouter);
app.use('/category', categoryRouter);

// Catch errors if all of routers above has no responses
app.use((req, res, next) => {
  const error = createError(
    404,
    'Запрашиваемой страницы не существует на сервере.',
  );
  next(error);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server has been started!');
});
