const express = require('express');
const router = express.Router();
const { getAlerts, updateAlertStatus } = require('../controllers/alertController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, getAlerts);
router.put('/:id/resolve', protect, authorize('Admin', 'Operator'), updateAlertStatus);

module.exports = router;
