const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor',
    required: true,
  },
  type: {
    type: String,
    enum: ['intrusion', 'unusual_activity', 'system_failure'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved', 'false_positive'],
    default: 'open',
  },
  isAI_Detected: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedAt: {
    type: Date,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Incident', incidentSchema);
