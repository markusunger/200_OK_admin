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
  saveRoute: async function saveRoute(apiName, path, originalPath, responses) {
    let result;

    try {
      const ApiModel = predefinedModels(apiName);
      result = ApiModel.findOneAndUpdate({
        path: originalPath || path,
      }, {
        path,
        data: responses,
      }, {
        new: true,
        upsert: true,
      });
    } catch (error) {
      throw (error);
    }

    return result;
  },

  // deletes a custom route with the provided path name
  deleteRoute: async function deleteRoute(apiName, path) {
    let result;

    try {
      const ApiModel = predefinedModels(apiName);
      result = await ApiModel.deleteOne({
        path,
      });
    } catch (error) {
      throw (error);
    }

    const { deletedCount } = result;
    return deletedCount;
  },
};
