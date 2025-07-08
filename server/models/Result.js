
const mongoose = require("mongoose");

// Create a flexible schema that can handle any subject
const resultSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    examType: { type: String, required: true },
    class: { type: String, required: true },
    mean: { type: Number, default: 0 },
    rubric: { type: String, default: "" },

    // Core subjects that might appear across classes
    Maths: { type: Number, default: null },
    English: { type: Number, default: null },
    Kiswahili: { type: Number, default: null },
    Integrated: { type: Number, default: null },
    Language: { type: Number, default: null },
    Reading: { type: Number, default: null },
    Environmental: { type: Number, default: null },
    Creative: { type: Number, default: null },
    CRE: { type: Number, default: null },
    cre_and_environmental: { type: Number, default: null },
    Kusoma: { type: Number, default: null },
    s_s: { type: Number, default: null },
    crt_s: { type: Number, default: null },
    s_s_crt_s_cre: { type: Number, default: null },
    Pretech: { type: Number, default: null },
    agri_n: { type: Number, default: null },
  },
  {
    timestamps: true,
    strict: false, // Allow additional fields not defined in schema
  },
);

module.exports = mongoose.model("Result", resultSchema);