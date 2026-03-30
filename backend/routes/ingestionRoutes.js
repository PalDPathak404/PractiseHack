const express = require('express');
const router = express.Router();
const { ingestSensorData, ingestDroneTelemetry } = require('../controllers/ingestionController');

router.post('/sensor', ingestSensorData);
router.post('/drone', ingestDroneTelemetry);

module.exports = router;
