const express = require('express');
const session = require('express-session');

const cfg = require('../services/config');
const auth = require('../services/auth')(cfg);

const router = express.Router();

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

router.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/faq', (req, res) => {
  res.render('faq');
});

router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

router.get('/login', auth.authenticate('github', {
  scope: ['read:user'],
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

router.get('/login/callback', auth.authenticate('github', {
  successRedirect: '/dashboard',
  failureRedirect: '/',
}));

module.exports = router;
