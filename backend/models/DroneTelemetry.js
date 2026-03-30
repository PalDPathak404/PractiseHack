const mongoose = require('mongoose');

const droneTelemetrySchema = new mongoose.Schema({
  droneId: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  altitude: {
    type: Number,
    required: true,
  },
  battery: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['patrolling', 'investigating', 'returning', 'low_battery'],
    default: 'patrolling',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const DroneTelemetry = mongoose.model('DroneTelemetry', droneTelemetrySchema);

module.exports = DroneTelemetry;
