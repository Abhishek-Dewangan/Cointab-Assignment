const mongoose = require('mongoose');
require('dotenv').config();

const connection = async () => {
  const mongodb_url = process.env.MONGODB_URL;
  mongoose.set('strictQuery', false);
  try {
    const connetionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(mongodb_url, connetionParams);
    console.log('Application is connected to database');
  } catch (error) {
    console.log('Unable to connect with database', error);
  }
};

module.exports = connection;
