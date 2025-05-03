const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Add task counts to each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        const completedTaskCount = await Task.countDocuments({ 
          project: project._id, 
          status: 'completed' 
        });
        
        return {
          ...project.toObject(),
          taskCount,
          completedTaskCount
        };
      })
    );
    
    res.json(projectsWithCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user already has 4 projects
    const projectCount = await Project.countDocuments({ user: req.user.id });
    if (projectCount >= 4) {
      return res.status(400).json({ msg: 'You have reached the maximum limit of 4 projects' });
    }

    const newProject = new Project({
      user: req.user.id,
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      category: req.body.category
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    const { name, description, dueDate, priority, category } = req.body;
    
    if (name) project.name = name;
    if (description) project.description = description;
    if (dueDate) project.dueDate = dueDate;
    if (priority) project.priority = priority;
    if (category) project.category = category;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete all tasks associated with the project
    await Task.deleteMany({ project: req.params.id });
    
    // Delete the project
    await project.deleteOne();

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/projects/:id/tasks
// @access  Private
exports.getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const tasks = await Task.find({ project: req.params.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};