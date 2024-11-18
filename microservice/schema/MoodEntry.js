// models/MoodEntry.js
const mongoose = require('mongoose');

// Journal Entry Schema
const journalEntrySchema = new mongoose.Schema({
  mood: { type: String, required: true },
  thoughts: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodEntry', journalEntrySchema);
