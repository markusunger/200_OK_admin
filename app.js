const express = require('express');
const ehb = require('express-handlebars');
const session = require('express-session');
const path = require('path');

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

module.exports = app;
