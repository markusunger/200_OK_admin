const Api = require('../models/api');
const User = require('../models/user');

module.exports = {
  connectApi: async function connectApi(userId, apiName, apiKey) {
    let apiCheck;
    try {
      apiCheck = await Api.findOne({ apiName });
    } catch (error) {
      throw error;
    }
    if (!apiCheck) throw new Error('API not found.');
    if (apiCheck.isConnected) throw new Error('API already connected.');
    if (apiCheck.apiKey !== apiKey) throw new Error('Wrong API key.');

    // if valid connect request, register api as connected and add to user
    try {
      const result = await Api.updateOne({
        apiName,
      }, {
        isConnected: true,
      });
      if (result.nModified < 1) throw new Error('Something went wrong.');
    } catch (error) {
      throw error;
    }

    try {
      const result = await User.updateOne({
        'github.id': userId,
      }, {
        $push: { connectedApis: apiName },
      });
      if (result.nModified < 1) throw new Error('Something went wrong.');
    } catch (error) {
      throw error;
    }

    return true;
  },
};
