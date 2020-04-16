const predefinedModels = require('../models/predefined');

module.exports = {
  getRoutes: async function getRoutes(apiName) {
    let data;

    try {
      data = await predefinedModels(apiName).find();
    } catch (error) {
      throw (error);
    }

    if (!data) throw (new Error('Custom routes could not be retrieved.'));
    return data;
  },
};
