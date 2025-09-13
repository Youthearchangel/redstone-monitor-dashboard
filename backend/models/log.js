const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
  timestamp: Date,
  token: String,
  redstonePrice: Number,
  redstoneTimestamp: Date,
  otherPrice: Number,
  otherTimestamp: Date,
  isStale: Boolean,
  isDelayed: Boolean,
  discrepancy: Number,  // % difference
  alertSent: Boolean
});

// Check if model already exists before creating it
module.exports = mongoose.models.Log || mongoose.model('Log', logSchema);