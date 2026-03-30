const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    }
  },
  alerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert',
  }],
  status: {
    type: String,
    enum: ['Open', 'Investigating', 'Closed'],
    default: 'Open',
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolutionNotes: {
    type: String,
  }
}, {
  timestamps: true,
});

// Index for geospatial queries
incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
