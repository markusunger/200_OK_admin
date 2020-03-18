const express = require('express');
const cors = require('cors');

const configController = require('../controllers/configController');

const corsOptions = {
  origin: 'http://localhost',
  methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
  maxAge: 3600,
};

const router = express.Router();

router.use(cors(corsOptions));

router.post('/', async (req, res, next) => {
  try {
    const { apiName, apiKey } = await configController.createApi();
    res.status(200).json({ apiName, apiKey });
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
