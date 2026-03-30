const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['CCTV', 'Motion', 'Heat', 'Seismic', 'Drone'],
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance'],
    default: 'Active',
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  lastPing: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Index for geospatial queries
sensorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Sensor', sensorSchema);
