const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../models/user');

module.exports = function auth(cfg) {
  passport.serializeUser((user, done) => {
    done(null, user.github.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ 'github.id': id });
      if (!user) return done(true, null);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  passport.use(new GitHubStrategy({
    clientID: cfg.GitHubId,
    clientSecret: cfg.GitHubSecret,
    callbackURL: cfg.GitHubCallback,
  }, async (accessToken, refreshToken, profile, done) => {
    process.nextTick(async () => {
      let user;

      try {
        user = await User.findOne({ 'github.id': profile.id });
      } catch (error) {
        return done(error, null);
      }

      if (user) return done(null, user);

      // create new user profile if it does not yet exist
      const newUser = new User({
        'github.id': profile.id,
        'github.name': profile.displayName,
        'github.avatar_url': profile.photos[0].value || '',
      });
      try {
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    });
  }));

  return passport;
};
