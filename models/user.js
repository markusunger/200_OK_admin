const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  github: {
    email: String,
    id: Number,
    name: String,
    avatar_url: String,
  },
  connectedApis: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
