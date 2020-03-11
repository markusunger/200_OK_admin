const Api = require('../models/api');

module.exports = {
  // creates a new API config
  createApi: async function createApi() {
    let result;

    try {
      const newApi = new Api({});
      result = await newApi.save();
    } catch (error) {
      throw (error);
    }

    if (!result) throw (new Error('Could not create new API.'));

    return result;
  },
};
