const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
  const alerts = await Alert.find({}).sort({ timestamp: -1 });

  if (alerts) {
    res.json(alerts);
  } else {
    res.status(404).json({ message: 'No alerts found' });
  }
};

const updateAlertStatus = async (req, res) => {
  const { status } = req.body;
  const alertId = req.params.id;

  try {
    const alert = await Alert.findById(alertId);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.status = status;
    const updatedAlert = await alert.save();

    const io = req.app.get('socketio');
    io.emit('ALERT_RESOLVED', updatedAlert);

    res.json(updatedAlert);
  } catch (error) {
    res.status(400).json({ message: 'Error updating alert status', error: error.message });
  }
};

module.exports = { getAlerts, updateAlertStatus };
