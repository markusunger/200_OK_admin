module.exports = {
  // drop-in middleware to ensure that the request originates from a user that is logged in
  ensureAuthentication: function ensureAuthenication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash('error', 'You need to log in to access that page.');
      res.redirect('/');
    }
  },

  // drop-in middleware to ensure that API-specific requests can only be made by their owners,
  // useable in any route with a parameter :apiName
  ensureOwnership: function ensureOwnership(req, res, next) {
    const { apiName } = req.params;
    if (!apiName) next();
    if (req.user.connectedApis.includes(apiName)) {
      next();
    } else {
      req.flash('error', `You are not the owner of the '${apiName}' API.`);
      res.redirect('/dashboard');
    }
  },
};
