const SensorData = require('../models/SensorData');
const DroneTelemetry = require('../models/DroneTelemetry');
const threatDetectionService = require('../services/threatDetectionService');

const ingestSensorData = async (req, res) => {
  const { sensorId, type, location, value } = req.body;

  try {
    const sensorData = await SensorData.create({
      sensorId,
      type,
      location,
      value,
    });

    const io = req.app.get('socketio');
    await threatDetectionService.processSensorData(sensorData, io);

    res.status(201).json({ message: 'Sensor data ingested successfully', sensorData });
  } catch (error) {
    res.status(400).json({ message: 'Error ingesting sensor data', error: error.message });
  }
};

const ingestDroneTelemetry = async (req, res) => {
  const { droneId, location, altitude, battery, status } = req.body;

  try {
    const droneData = await DroneTelemetry.create({
      droneId,
      location,
      altitude,
      battery,
      status,
    });

    const io = req.app.get('socketio');
    await threatDetectionService.processDroneTelemetry(droneData, io);

    res.status(201).json({ message: 'Drone telemetry ingested successfully', droneData });
  } catch (error) {
    res.status(400).json({ message: 'Error ingesting drone telemetry', error: error.message });
  }
};

module.exports = { ingestSensorData, ingestDroneTelemetry };
