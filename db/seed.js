const mongoose = require('mongoose');
const User = require('../models/user.model');
const Adventure = require('../models/adventure.model');
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

const seed = async () => {
  await User.deleteMany();
  await Adventure.deleteMany();

  await userSeed();
  await adventureSeed();

  mongoose.disconnect();
};

seed();
