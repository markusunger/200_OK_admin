// middleware to check:
// - that a user is authenticated and logged in
// - that a user has ownership when accessing API-specific functionality

module.exports = {
  ensureAuthentication: function ensureAuthenication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else if (req.flash) {
      req.flash('error', 'You need to log in to access that page.');
      res.redirect('/');
    } else {
      res.status(403);
      next(new Error('You need to log in to be able to make that request.'));
    }
  },

  // useable in any route with a parameter :apiName
  ensureOwnership: function ensureOwnership(req, res, next) {
    const { apiName } = req.params;
    if (!apiName) next();
    if (req.user.connectedApis.includes(apiName)) {
      next();
    } else if (req.flash) {
      req.flash('error', `You are not the owner of the '${apiName}' API.`);
      res.redirect('/dashboard');
    } else {
      res.status(403);
      next(new Error(`You cannot make that request as you are not the owner of '${apiName}'.`));
    }
  },
};
