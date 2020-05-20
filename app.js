const express = require('express');
const ehb = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');

const frontendRouter = require('./routes/frontendRouter');
const apiRouter = require('./routes/apiRouter');

const cfg = require('./services/config');
require('./services/data')(cfg);
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
  proxy: true,
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

// catch-all route to handle 404's
app.use((req, res) => {
  res.render('static/404');
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
