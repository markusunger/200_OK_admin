const express = require('express');
const ehb = require('express-handlebars');
const path = require('path');

const frontendRouter = require('./routes/frontendRouter');
const apiRouter = require('./routes/apiRouter');

const cfg = require('./services/config');
require('./services/data')(cfg);

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

app.use('/api', express.json());
app.use('/api', apiRouter);

app.use('/', frontendRouter);

module.exports = app;
