const express = require('express');
const flash = require('connect-flash');

const dashboardController = require('../controllers/dashboardController');
const auth = require('../middlewares/authorize');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(flash());

// set user data and flash messages to res.locals for usage in templates
router.use((req, res, next) => {
  res.locals.flash_success = req.flash('success');
  res.locals.flash_error = req.flash('error');

  if (req.isAuthenticated()) {
    res.locals.isAuthenticated = true;
    res.locals.connectedApis = req.user.connectedApis;
    res.locals.hasConnectedApis = req.user.connectedApis.length > 0;
    res.locals.githubInfo = req.user.github;
  }
  next();
});

// front page
router.get('/', (req, res) => {
  res.render('index');
});

// FAQ / documentation
router.get('/faq', (req, res) => {
  res.render('faq');
});

// user dashboard
router.get('/dashboard', auth.ensureAuthentication, (req, res) => {
  res.render('admin/dashboard');
});

// connection of APIs to users
router.get('/connect', auth.ensureAuthentication, (req, res) => {
  res.render('admin/connect');
});

router.post('/connect', auth.ensureAuthentication, async (req, res) => {
  const userId = req.user.github.id;
  const apiName = req.body['api-name'];
  const apiKey = req.body['api-key'];

  if (!apiName || !apiKey) {
    req.flash('error', 'API name and API key are required.');
    req.redirect('/connect');
  }

  try {
    const result = await dashboardController.connectApi(userId, apiName, apiKey);
    if (result) {
      req.flash('success', `API '${apiName}' successfully connected.`);
      res.redirect('/dashboard');
    }
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/connect');
  }
});

// live debugging of API requests/responses
router.get('/debug/:apiName', auth.ensureAuthentication, auth.ensureOwnership, (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('API name not provided.'));

  res.render('admin/debug', { apiName });
});

// customization page for user-defined endpoint behavior
router.get('/customize/:apiName', auth.ensureAuthentication, auth.ensureOwnership, (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('API name not provided.'));

  res.render('admin/customize', { apiName });
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
