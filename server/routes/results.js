const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// Get all results
router.get('/', async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results); // class field included by default
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get results by exam type
router.get('/:examType', async (req, res) => {
  try {
    const results = await Result.find({ examType: req.params.examType });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new result (ensure class is saved)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      math,
      english,
      science,
      mean,
      rubric,
      examType,
      class: studentClass // get class from request body
    } = req.body;

    const result = new Result({
      name,
      math,
      english,
      science,
      mean,
      rubric,
      examType,
      class: studentClass // save class
    });

    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a result (ensure class is updated)
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      math,
      english,
      science,
      mean,
      rubric,
      examType,
      class: studentClass // get class from request body
    } = req.body;

    const result = await Result.findByIdAndUpdate(
      req.params.id,
      {
        name,
        math,
        english,
        science,
        mean,
        rubric,
        examType,
        class: studentClass // update class
      },
      { new: true }
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a result
router.delete('/:id', async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;