const mongoose = require('mongoose');
const moment = require('moment');
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

  apiSchema.set('toObject', { virtuals: true });
  apiSchema.set('toJSON', { virtuals: true });

  apiSchema.virtual('expiresIn')
    .get(function getExpiresIn() {
      const expiryDate = moment(this.createdAt).add(7, 'days');
      return expiryDate.fromNow();
    });

  apiSchema.virtual('createdAtFormatted')
    .get(function getCreatedAtFormatted() {
      return moment(this.createdAt).format('dddd, MMMM Do YYYY, HH:mm');
    });

  apiSchema.pre('save', async function uniqueApiNameHook(next) {
    let uniqueName = false;
    while (!uniqueName) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await mongoose.models.ApiConfig.findOne({
          apiName: this.apiName,
        });
        if (result) {
          this.apiName = createApiName();
        } else {
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
