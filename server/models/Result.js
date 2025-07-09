
const mongoose = require("mongoose");

// Create a flexible schema that can handle any subject
const resultSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    examType: { type: String, required: true },
    class: { type: String, required: true },
    mean: { type: Number, default: 0 },
    rubric: { type: String, default: "" },

    // Core subjects that appear across classes (lowercase to match frontend)
    maths: { type: Number, default: null },
    english: { type: Number, default: null },
    kiswahili: { type: Number, default: null },
    language: { type: Number, default: null },
    reading: { type: Number, default: null },
    environmental: { type: Number, default: null },
    integrated: { type: Number, default: null },
    creative: { type: Number, default: null },
    cre: { type: Number, default: null },
    kusoma: { type: Number, default: null },
    social: { type: Number, default: null },
    pretech: { type: Number, default: null },
    agriculture: { type: Number, default: null },
  },
  {
    timestamps: true,
    strict: false, // Allow additional fields not defined in schema
  },
);

module.exports = mongoose.model("Result", resultSchema);