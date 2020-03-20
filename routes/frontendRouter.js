const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const dashboardController = require('../controllers/dashboardController');

const cfg = require('../services/config');
const auth = require('../services/auth')(cfg);

const router = express.Router();

const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You need to log in to access that page.');
    res.redirect('/');
  }
};

router.use(express.urlencoded({ extended: true }));

router.use(session({
  saveUninitialized: true,
  resave: true,
  maxAge: 1209600, // 14 days
  secure: false, // set to true for prod!!
  proxy: true,
  secret: cfg.cookieSecret,
}));

router.use(auth.initialize());
router.use(auth.session());

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


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/faq', (req, res) => {
  res.render('faq');
});

router.get('/dashboard', ensureAuth, (req, res) => {
  console.log(res.locals);
  res.render('admin/dashboard');
});

router.get('/connect', ensureAuth, (req, res) => {
  res.render('admin/connect');
});

router.post('/connect', ensureAuth, async (req, res) => {
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
      req.flash('success', `API <em>${apiName}</em> successfully connected.`);
      res.redirect('/dashboard');
    }
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/connect');
  }
});

router.get('/login', auth.authenticate('github', {
  scope: ['read:user'],
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

router.get('/login/callback', auth.authenticate('github', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
