const Alert = require('../models/Alert');

const processSensorData = async (data, io) => {
  const { sensorId, type, location, value } = data;
  let alertTriggered = false;
  let alertTitle = '';
  let alertDescription = '';
  let severity = 'low';

  // Rule-based logic
  if (type === 'motion' && value > 0) {
    alertTriggered = true;
    alertTitle = 'Unauthorized Movement Detected';
    alertDescription = `Motion sensor ${sensorId} triggered at [${location.latitude}, ${location.longitude}].`;
    severity = 'medium';
  } else if (type === 'heat' && value > 40) {
    alertTriggered = true;
    alertTitle = 'Heat Signature Detected';
    alertDescription = `Heat sensor ${sensorId} detected high temperature of ${value}°C. Potential human or vehicle presence.`;
    severity = value > 50 ? 'high' : 'medium';
  } else if (type === 'seismic' && value > 5) {
    alertTriggered = true;
    alertTitle = 'Ground Disturbance Detected';
    alertDescription = `Seismic sensor ${sensorId} detected vibrations level ${value}. Possible heavy vehicle or underground movement.`;
    severity = 'high';
  }

  if (alertTriggered) {
    const newAlert = await Alert.create({
      title: alertTitle,
      description: alertDescription,
      severity,
      location,
      sourceId: sensorId,
      sourceType: 'sensor',
    });

    console.log(`Alert created: ${alertTitle}`);
    // Broadcast to all connected clients
    io.emit('NEW_ALERT', newAlert);
  }
};

const processDroneTelemetry = async (data, io) => {
  const { droneId, location, battery, status } = data;

  // Real-time position update for dashboard
  io.emit('DRONE_UPDATE', data);

  if (battery < 15) {
    const newAlert = await Alert.create({
      title: 'Drone Battery Low',
      description: `Drone ${droneId} has low battery (${battery}%). Immediate return recommended.`,
      severity: 'medium',
      location,
      sourceId: droneId,
      sourceType: 'drone',
    });
    io.emit('NEW_ALERT', newAlert);
  }
};

module.exports = { processSensorData, processDroneTelemetry };
