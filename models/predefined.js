const mongoose = require('mongoose');

module.exports = (function predefinedModel() {
  const predefinedModels = {};

  const predefinedSchema = new mongoose.Schema({
    path: String,
    data: Object,
  });

  return (apiName) => {
    if (!Object.prototype.hasOwnProperty.call(predefinedModels, apiName)) {
      predefinedModels[apiName] = mongoose.model(`pre:${apiName}`, predefinedSchema, `pre:${apiName}`);
    }
    return predefinedModels[apiName];
  };
}());
