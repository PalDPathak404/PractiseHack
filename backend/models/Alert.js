const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
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
  sourceId: {
    type: String,
    required: true,
  },
  sourceType: {
    type: String,
    enum: ['sensor', 'drone', 'manual'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'dismissed'],
    default: 'active',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
