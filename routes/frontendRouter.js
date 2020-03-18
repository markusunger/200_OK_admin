const express = require('express');
const session = require('express-session');

const cfg = require('../services/config');
const auth = require('../services/auth')(cfg);

const router = express.Router();

const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

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

// set user data to res.locals for usage in templates
router.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  if (res.locals.isAuthenticated) {
    res.locals.connectedApis = req.user.connectedApis;
    res.locals.hasConnectedAPIs = res.locals.connectedApis > 0;
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
  res.render('admin/dashboard');
});

router.get('/connect', ensureAuth, (req, res) => {
  res.render('admin/connect');
});

router.post('/connect', ensureAuth, async (req, res) => {
  
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
