const express = require('express');
const cors = require('cors');

const ajaxController = require('../controllers/ajaxController');
const auth = require('../middlewares/authorize');

const corsOptions = {
  origin: 'http://localhost',
  methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
  maxAge: 3600,
};

const router = express.Router();

router.use(cors(corsOptions));

router.post('/', async (req, res, next) => {
  try {
    const { apiName, apiKey } = await ajaxController.createApi();
    res.status(200).json({ apiName, apiKey });
  } catch (error) {
    next(error);
  }
});

router.get('/info/:apiName', auth.ensureAuthentication, auth.ensureOwnership, async (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('No API name provided.'));

  try {
    const apiInfo = await ajaxController.getApiInfo(apiName);
    res.status(200).json(apiInfo);
  } catch (error) {
    next(error);
  }
});

router.get('/debug-stream/:apiName', auth.ensureAuthentication, auth.ensureOwnership, (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('No API name provided'));

  req.socket.setTimeout(0);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('\n');

  ajaxController.getSSE(req, res, apiName);
});

// general error handling middleware
// TODO: improve! :P
router.use((err, req, res, next) => {
  console.error(err);
  if (res.statusCode === 200) res.status(500);
  res.end();
});

module.exports = router;
