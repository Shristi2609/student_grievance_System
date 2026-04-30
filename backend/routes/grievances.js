const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Grievance = require('../models/Grievance');

// @route   POST api/grievances
// @desc    Submit grievance
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const newGrievance = new Grievance({
      title,
      description,
      category,
      student: req.student.id
    });

    const grievance = await newGrievance.save();
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/grievances/search
// @desc    Search grievance by title
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ msg: 'Please provide a search term' });
    }

    // Search where student matches AND title contains the query
    const grievances = await Grievance.find({
      student: req.student.id,
      title: { $regex: title, $options: 'i' }
    }).sort({ date: -1 });
    
    res.json(grievances);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/grievances
// @desc    View all grievances for a logged-in student
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.student.id }).sort({ date: -1 });
    res.json(grievances);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/grievances/:id
// @desc    View grievance by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: 'Grievance not found' });

    // Make sure student owns grievance
    if (grievance.student.toString() !== req.student.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/grievances/:id
// @desc    Update grievance
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    // Build grievance object
    const grievanceFields = {};
    if (title) grievanceFields.title = title;
    if (description) grievanceFields.description = description;
    if (category) grievanceFields.category = category;
    if (status) grievanceFields.status = status;

    let grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: 'Grievance not found' });

    // Make sure user owns grievance
    if (grievance.student.toString() !== req.student.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { $set: grievanceFields },
      { new: true }
    );

    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/grievances/:id
// @desc    Delete grievance
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: 'Grievance not found' });

    // Make sure user owns grievance
    if (grievance.student.toString() !== req.student.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Grievance.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Grievance removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
