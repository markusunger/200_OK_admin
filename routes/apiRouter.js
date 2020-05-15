const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const apiController = require('../controllers/apiController');
const customizationController = require('../controllers/customizationController');
const auth = require('../middlewares/authorize');
const CustomError = require('../lib/customError');

const corsOptions = {
  origin: 'http://localhost',
  methods: ['GET', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
  maxAge: 3600,
};

// configure rate limiter to prevent more than two anonymously created APIs per minute
const creationLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 2,
  handler: (req, res) => {
    res.status(500).json({
      error: 'Slow down, cowboy.',
    });
  },
});

const router = express.Router();

router.use(cors(corsOptions));

// AJAX call for anonymous API creation
router.post('/create', creationLimiter, async (req, res, next) => {
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
  if (!apiName) next(new CustomError('No API name provided.', 400));

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
  if (!apiName) next(new CustomError('No API name provided.', 400));

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
  if (!apiName) next(new CustomError('No API name provided.', 400));
  const { path, originalPath, responses } = req.body;
  if (!path || !responses) next(new CustomError('Insufficient custom route information provided.', 400));

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
  if (!apiName) next(new CustomError('No API name provided.', 400));
  if (!path) next(new CustomError('Insufficient route information provided.', 400));

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
  if (!apiName) next(new CustomError('No API name provided', 400));

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
  if (err instanceof CustomError) {
    res.status(err.responseCode);
    res.json({
      error: err.message,
    });
  } else {
    res.status(500);
    res.json({
      error: 'Something went wrong.',
    });
  }
});

module.exports = router;
