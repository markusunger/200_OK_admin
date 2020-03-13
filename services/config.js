require('dotenv').config();

module.exports = {
  nodePort: process.env.NODE_PORT,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDb: process.env.MONGO_DB,

  GitHubId: process.env.GITHUB_CLIENT_ID,
  GitHubSecret: process.env.GITHUB_CLIENT_SECRET,
  GitHubCallback: process.env.GITHUB_CALLBACK,

  cookieSecret: process.env.COOKIE_SECRET,
};
