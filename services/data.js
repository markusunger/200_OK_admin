const mongoose = require('mongoose');
const cfg = require('./config');

module.exports = (async function dataService() {
  const mongoUri = `mongodb://${cfg.mongoHost}:${cfg.mongoPort}/${cfg.mongoDb}`;

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected to MongoDB database ...');
  } catch (error) {
    console.error(error);
    return null;
  }

  mongoose.connection.on('error', error => console.error(error));

  const { db } = mongoose.connection;

  return db;
}());
