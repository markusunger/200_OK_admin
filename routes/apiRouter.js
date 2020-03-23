const express = require('express');
const cors = require('cors');

const ajaxController = require('../controllers/ajaxController');

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

router.get('/info/:apiName', async (req, res, next) => {
  const { apiName } = req.params;
  if (!apiName) next(new Error('No API name provided.'));

  try {
    const apiInfo = await ajaxController.getApiInfo(apiName);
    res.status(200).json(apiInfo);
  } catch (error) {
    next(error);
  }
});

// general error handling middleware
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).end();
});

module.exports = router;
