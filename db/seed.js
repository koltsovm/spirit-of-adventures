const mongoose = require('mongoose');
const User = require('../models/user.model');
const Adventure = require('../models/adventure.model');
const Category = require('../models/category.model');
const dbConnect = require('./db');

dbConnect();

const userSeed = async () => {
  for (let i = 0; i < 10; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await User.create({
      name: `User ${i}`,
      lastName: `Lastname ${i}`,
      username: `username ${i}`,
      email: `testEmail${i}@gmail.com`,
      city: `${i}`,
      avatar: `${i}`,
      password: `${i}`,
    });
  }
};

const adventureSeed = async () => {
  const creator1 = await User.findOne({ name: 'User 1' });
  const creator3 = await User.findOne({ name: 'User 3' });

  await Adventure.create({
    title: 'Adventure1',
    creator: creator1.id,
    category: 'testCategory',
    description: 'testDescription',
    routePlan: 'testRoutePlan',
    coordinates: 'testCoordinates',
    photos: '/img/1.jpg',
  });

  await Adventure.create({
    title: 'Adventure2',
    creator: creator1.id,
    category: 'testCategory',
    description: 'testDescription',
    routePlan: 'testRoutePlan',
    coordinates: 'testCoordinates',
    photos: '/img/2.jpg',
  });

  await Adventure.create({
    title: 'Adventure3',
    creator: creator3.id,
    category: 'testCategory',
    description: 'testDescription',
    routePlan: 'testRoutePlan',
    coordinates: 'testCoordinates',
    photos: '/img/3.jpg',
  });
};

const categorySeed = async () => {
  await Category.create({
    categoryName: 'Природа',
    categoryImage: 'Природа.png',
  });

  await Category.create({
    categoryName: 'Город',
    categoryImage: 'Город.png',
  });

  await Category.create({
    categoryName: 'Архитектура',
    categoryImage: 'Архитектура.png',
  });

  await Category.create({
    categoryName: 'Активный отдых',
    categoryImage: 'Активный отдых.png',
  });

  await Category.create({
    categoryName: 'Пешком',
    categoryImage: 'Пешком.png',
  });

  await Category.create({
    categoryName: 'На машине',
    categoryImage: 'На машине.png',
  });

  await Category.create({
    categoryName: 'На велосипеде',
    categoryImage: 'На велосипеде.png',
  });
};

const seed = async () => {
  // await User.deleteMany();
  // await Adventure.deleteMany();
  await Category.deleteMany();

  // await userSeed();
  // await adventureSeed();
  await categorySeed();

  mongoose.disconnect();
};

seed();
