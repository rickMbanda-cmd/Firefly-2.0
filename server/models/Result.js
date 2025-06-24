const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  name: String,
  math: Number,
  english: Number,
  science: Number,
  mean: Number,
  rubric: String,
  examType: { type: String, enum: ['opener', 'midterm', 'endterm'] },
  class: String // <-- Added class field to schema
});

module.exports = mongoose.model('Result', ResultSchema);