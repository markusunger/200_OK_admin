const express = require('express');
const ehb = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');

const frontendRouter = require('./routes/frontendRouter');
const apiRouter = require('./routes/apiRouter');

const cfg = require('./services/config');
require('./services/data');
const authService = require('./services/auth')(cfg);

const app = express();

app.disable('x-powered-by');

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', ehb({
  layoutsDir: './views/layouts',
  defaultLayout: 'main',
  extname: '.hbs',
}));

app.use(express.static(path.join(__dirname, 'public')));

// globally enable authentication
app.use(session({
  saveUninitialized: true,
  resave: true,
  maxAge: 3600,
  secure: true,
  httpOnly: true,
  proxy: true,
  name: '200ok_session',
  secret: cfg.cookieSecret,
}));

app.use(authService.initialize());
app.use(authService.session());

app.get('/login', authService.authenticate('github', {
  scope: ['read:user'],
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

app.get('/login/callback', authService.authenticate('github', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

app.use('/api', express.json());
app.use('/api', apiRouter);

app.use('/', frontendRouter);

// catch-all route to forward 404 errors to error handler
app.use((req, res, next) => {
  const error = new Error(`Page not found: ${req.url}`);
  error.status = 404;
  next(error);
});

// error handler to send proper 404 and 500 pages
app.use((err, req, res, next) => {
  if (app.get('env') === 'development') console.error(err);
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render('static/404');
  } else {
    res.render('static/500');
  }
});

const gracefulShutdown = async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit();
};

process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', gracefulShutdown);
process.on('unhandledRejection', gracefulShutdown);

module.exports = app;
