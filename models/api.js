const mongoose = require('mongoose');
const crypto = require('crypto');

const words = require('../lib/words');

module.exports = (function apiModel() {
  function createApiName() {
    // TODO: prevent duplicates
    const adjective = words.adjectives[Math.floor(Math.random() * words.adjectives.length)];
    const name = words.names[Math.floor(Math.random() * words.names.length)];
    return `${adjective}-${name}`;
  }

  function createApiKey() {
    // this is not cryptographically secure, but it's fast and easy
    // and will suffice for the intended use case
    const key = crypto.randomBytes(12)
      .toString('hex')
      .toUpperCase()
      .match(/(.{4})/g)
      .join('-');
    return key;
  }

  const apiSchema = new mongoose.Schema({
    apiName: {
      type: String,
      default: createApiName,
      unique: true,
    },
    apiKey: {
      type: String,
      default: createApiKey,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
  });

  apiSchema.pre('save', async function uniqueApiNameHook(next) {
    // TODO: remove comments (for now, I just want to check logs if it handles
    // duplicates correctly in all cases)
    let uniqueName = false;
    console.log(`Checking API name ${this.apiName} ...`);
    while (!uniqueName) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await mongoose.models.ApiConfig.findOne({
          apiName: this.apiName,
        });
        if (result) {
          this.apiName = createApiName();
          console.log(`Not unique! Creating new name: ${this.apiName} ...`);
        } else {
          console.log("It's unique. Moving on ...");
          uniqueName = true;
          next();
        }
      } catch (error) {
        next(error);
      }
    }
    next();
  });

  const Api = mongoose.model('ApiConfig', apiSchema, 'apiConfig');

  return Api;
}());
