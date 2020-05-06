const express = require('express');
const cors = require('cors');

const apiController = require('../controllers/apiController');
const customizationController = require('../controllers/customizationController');
const auth = require('../middlewares/authorize');

const corsOptions = {
  origin: 'http://localhost',
  methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
  maxAge: 3600,
};

const router = express.Router();

router.use(cors(corsOptions));

// AJAX call for API creation directly from the anonymous front page
router.post('/', async (req, res, next) => {
  try {
    const { apiName, apiKey } = await apiController.createApi();
    res.status(200).json({ apiName, apiKey });
  } catch (error) {
    next(error);
  }
});

// AJAX call for API details from the user-specific dashboard
router.get('/info/:apiName', auth.ensureAuthentication, auth.ensureOwnership, async (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('No API name provided.'));

  try {
    const apiInfo = await apiController.getApiInfo(apiName);
    res.status(200).json(apiInfo);
  } catch (error) {
    next(error);
  }
});

// AJAX call for customized endpoints from the customization page
router.get('/customize/:apiName', auth.ensureAuthentication, auth.ensureOwnership, async (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('No API name provided.'));

  try {
    const customRoutes = await customizationController.getRoutes(apiName);
    res.status(200).json(customRoutes);
  } catch (error) {
    next(error);
  }
});

// AJAX call for saving custom endpoint behavior from the customization page
router.post('/customize/:apiName/save', auth.ensureAuthentication, auth.ensureOwnership, async (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('No API name provided.'));
  const { path, originalPath, responses } = req.body;
  if (!path || !responses) next(new Error('Insufficient custom route information provided.'));

  try {
    await customizationController.saveRoute(apiName, path, originalPath, responses);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// AJAX call for deletion of custom endpoint from the customization page
router.delete('/customize/:apiName/:path', auth.ensureAuthentication, auth.ensureOwnership, async (req, res, next) => {
  const { apiName, path } = req.params;
  if (!apiName || !path) next(new Error('Insufficient route information provided.'));

  try {
    await customizationController.deleteRoute(apiName, path);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// AJAX call for SSE stream from the live debugging page
router.get('/debug-stream/:apiName', auth.ensureAuthentication, auth.ensureOwnership, (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('No API name provided'));

  // prepare connection for SSE text/event-stream payload
  // FIX: this currently does not seem to have an effect
  req.socket.setTimeout(0);
  res.connection.setTimeout(0);

  // set status (needs to be 200), required headers and first newline
  res.status(200).set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('\n');

  apiController.getSSE(req, res, apiName);
});

// general error handling middleware
router.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') console.error(err);
  // eslint-disable-next-line valid-typeof
  if (typeof err === 'CustomError') {
    res.status(err.responseCode);
    res.json({
      error: err.message,
    });
  } else {
    res.status(500);
    res.end();
  }
});

module.exports = router;
