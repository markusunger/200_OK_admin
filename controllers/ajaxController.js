const Api = require('../models/api');
const subscriber = require('../services/subscriber');

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

    if (!result) throw (new Error('Could not create new API.'));

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

    if (!result) throw (new Error('Could not retrieve API information.'));

    return result;
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
