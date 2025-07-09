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
router.get('/exam/:examType', async (req, res) => {
  try {
    const results = await Result.find({ examType: req.params.examType });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get results by class
router.get('/class/:className', async (req, res) => {
  try {
    const results = await Result.find({ class: req.params.className });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get results by class and exam type
router.get('/class/:className/exam/:examType', async (req, res) => {
  try {
    const results = await Result.find({ 
      class: req.params.className, 
      examType: req.params.examType 
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new result (ensure class is saved)
router.post('/', async (req, res) => {
  try {
    const resultData = { ...req.body };
    
    const result = new Result(resultData);
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a result (ensure class is updated)
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      updateData,
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