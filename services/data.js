const mongoose = require('mongoose');

module.exports = async function dataService(cfg) {
  const mongoUri = `mongodb://${cfg.mongoHost}:${cfg.mongoPort}/${cfg.mongoDb}`;

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
  mongoose.connection.on('error', error => console.error(error));

  return true;
};
