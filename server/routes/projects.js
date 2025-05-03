const express = require('express');
const { check, validationResult } = require('express-validator');
const { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  getProjectTasks 
} = require('../controllers/projects');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/projects
// @desc    Get all projects for user
// @access  Private
router.get('/', protect, getProjects);

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', protect, getProject);

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  createProject
);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', protect, updateProject);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', protect, deleteProject);

// @route   GET api/projects/:id/tasks
// @desc    Get all tasks for a project
// @access  Private
router.get('/:id/tasks', protect, getProjectTasks);

module.exports = router;