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
  });

  const Api = mongoose.model('ApiConfig', apiSchema, 'apiConfig');

  return Api;
}());
