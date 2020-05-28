// access to native db driver for API deletion operations
let db;
(async () => {
  // eslint-disable-next-line global-require
  db = await require('../services/data');
})();

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const Api = require('../models/api');
const User = require('../models/user');
const subscriber = require('../services/subscriber');
const CustomError = require('../lib/customError');

module.exports = {
  // creates a new API
  createApi: async function createApi() {
    let result;

    try {
      const newApi = new Api({});
      result = await newApi.save();
    } catch (error) {
      throw error;
    }

    if (!result) throw (new CustomError('Could not create new API.'));

    return result;
  },

  // deletes an existing API
  // this uses the native MongoDB driver on the connection as returned by services/data
  // this feels a bit hacky but uses the most effective interface for what should be a
  // transactional operation (which is not possible in my current setup, shouldn't have used Mongo)
  deleteApi: async function deleteApi(apiName) {
    if (!db) return false;
    console.log(`Deleting API: ${apiName} ...`);

    // delete data and custom endpoint collections
    // (if they exist, dropping them without check would interrupt the connection, thx Mongo)
    try {
      let collectionList = await db.listCollections().toArray();
      collectionList = collectionList.map(c => c.name);

      const hasData = collectionList.includes(`api:${apiName}`);
      if (hasData) {
        await db.dropCollection(`api:${apiName}`);
        console.log(`Collection api:${apiName} dropped.`);
      } else {
        console.log(`Collection api:${apiName} didn't exist.`);
      }

      const hasCustom = collectionList.includes(`pre:${apiName}`);
      if (hasCustom) {
        await db.dropCollection(`pre:${apiName}`);
        console.log(`Collection pre:${apiName} dropped.`);
      } else {
        console.log(`Collection pre:${apiName} didn't exist.`);
      }
    } catch (error) {
      console.error(error);
      return false;
    }

    try {
      // remove residual id counters
      const idRemoval = await db.collection('idStore').deleteMany({
        resource: { $regex: `^${apiName}` },
      });
      console.log(`${idRemoval.deletedCount} entries from id counter collection removed.`);

      // remove API from connected API list of user
      const userCleanup = await db.collection('users').findOneAndUpdate({
        connectedApis: apiName,
      }, {
        $pull: {
          connectedApis: apiName,
        },
      });
      if (userCleanup.value) {
        console.log(`Removed entry from user ${userCleanup.value.github.name}'s collection.`);
      } else {
        console.log('API was not connected to a user.');
      }

      // remove API from central api config collection
      const apiRemoval = await db.collection('apiConfig').deleteOne({
        apiName,
      });
      if (apiRemoval.deletedCount > 0) {
        console.log('Successfully removed API from the database.');
      } else {
        console.log('WARNING! API was not fully removed from the database (entry in apiConfig not found or deleted).');
      }
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  },

  // returns information about a specific API
  getApiInfo: async function getApiInfo(apiName) {
    let result;

    try {
      result = await Api.findOne({ apiName });
    } catch (error) {
      throw error;
    }

    if (!result) throw (new CustomError('Could not retrieve API information.'));

    return result;
  },

  // connects an API to a specific user
  connectApi: async function connectApi(userId, apiName, apiKey) {
    let apiCheck;
    try {
      apiCheck = await Api.findOne({ apiName: apiName.trim() });
    } catch (error) {
      throw error;
    }
    if (!apiCheck) throw new CustomError('API not found.', 400);
    if (apiCheck.isConnected) throw new CustomError('API already connected.', 403);
    if (apiCheck.apiKey !== apiKey.trim()) throw new CustomError('Wrong API key.', 403);

    // if valid connect request, register api as connected and add to user
    try {
      const result = await Api.updateOne({
        apiName: apiName.trim(),
      }, {
        isConnected: true,
      });
      if (result.nModified < 1) throw new CustomError('Something went wrong.');
    } catch (error) {
      throw error;
    }

    try {
      const result = await User.updateOne({
        'github.id': userId,
      }, {
        $push: { connectedApis: apiName.trim() },
      });
      if (result.nModified < 1) throw new CustomError('Something went wrong.');
    } catch (error) {
      throw error;
    }

    return true;
  },

  // enables or disables auth mode for an API, creates and saves bearer token as well
  authApi: async function authApi(apiName) {
    const createBearerToken = () => crypto.randomBytes(30).toString('base64');

    let isPrivate;
    let bearerToken;
    let saveBearerToken;

    try {
      const result = await Api.findOne({ apiName });
      if (!result) throw new CustomError('API not found.');
      ({ isPrivate } = result);
    } catch (error) {
      throw error;
    }

    if (!isPrivate) {
      bearerToken = createBearerToken();
      try {
        saveBearerToken = await bcrypt.hash(bearerToken, 10);
      } catch (error) {
        throw error;
      }
    }
    const isNewPrivate = !isPrivate;

    try {
      const result = await Api.updateOne({
        apiName,
      }, {
        isPrivate: isNewPrivate,
        bearerToken: saveBearerToken || '',
      });
      if (result.nModified < 1) throw new CustomError('Something went wrong.');
    } catch (error) {
      throw error;
    }

    return isNewPrivate ? bearerToken : false;
  },

  // creates and immediately connects an API to a specific user (that needs to be logged in)
  createAndConnectApi: async function createAndConnectApi(userId) {
    const { apiName, apiKey } = await this.createApi();
    const connected = await this.connectApi(userId, apiName, apiKey);
    return connected ? apiName : null;
  },

  // listens for published API messages on Redis and sends them to the client
  getSSE: function getSSE(req, res, apiName) {
    const listener = subscriber.subscribe(apiName);
    let messageId = 0;

    // send a regular heartbeat comment (':\n\n') to prevent
    // connection timeouts (that do not seem to be the standard
    // Node.js socket timeouts)
    const heartbeatTimer = setInterval(() => {
      res.write(':\n\n');
    }, 10000);

    listener.on('error', (error) => {
      console.error(error);
      clearInterval(heartbeatTimer);
      res.end();
    });

    listener.on('message', (ch, message) => {
      res.write(`id: ${messageId}\n`);
      res.write(`data: ${message}\n\n`);
      messageId += 1;
    });

    req.on('close', () => {
      clearInterval(heartbeatTimer);
      listener.unsubscribe(apiName);
    });
  },
};
