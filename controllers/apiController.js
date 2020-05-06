const Api = require('../models/api');
const User = require('../models/user');
const subscriber = require('../services/subscriber');
const CustomError = require('../lib/customError');

module.exports = {
  // creates a new API config
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
      apiCheck = await Api.findOne({ apiName });
    } catch (error) {
      throw error;
    }
    if (!apiCheck) throw new CustomError('API not found.', 400);
    if (apiCheck.isConnected) throw new CustomError('API already connected.', 403);
    if (apiCheck.apiKey !== apiKey) throw new CustomError('Wrong API key.', 403);

    // if valid connect request, register api as connected and add to user
    try {
      const result = await Api.updateOne({
        apiName,
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
        $push: { connectedApis: apiName },
      });
      if (result.nModified < 1) throw new CustomError('Something went wrong.');
    } catch (error) {
      throw error;
    }

    return true;
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
