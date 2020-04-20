const predefinedModels = require('../models/predefined');

module.exports = {
  // retrieves and returns all predefined custom routes
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

  // saves route responses if route exists or creates new custom route
  saveRoute: async function saveRoute(apiName, path, responses) {
    let result;

    try {
      const ApiModel = predefinedModels(apiName);
      const newRoute = new ApiModel({
        path: '/new-custom-route',
        data: {},
      });
      result = await newRoute.save();
    } catch (error) {
      throw (error);
    }

    return result;
  },
};
