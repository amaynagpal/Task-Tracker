const Task = require('../models/Task');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    // Check if project exists and user owns it
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return next(
        new ErrorResponse(`Project not found with id of ${req.params.projectId}`, 404)
      );
    }
    
    // Make sure user owns the project
    if (project.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to access tasks for this project`, 401)
      );
    }
    
    const tasks = await Task.find({ project: req.params.projectId });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate({
      path: 'project',
      select: 'title user'
    });

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to access this task`, 401)
      );
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    req.body.project = req.params.projectId;
    req.body.user = req.user.id;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(
        new ErrorResponse(`Project not found with id of ${req.params.projectId}`, 404)
      );
    }

    // Make sure user owns the project
    if (project.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to add tasks to this project`, 401)
      );
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to update this task`, 401)
      );
    }

    // If status is being changed to Complete, set completedAt date
    if (req.body.status === 'Complete' && task.status !== 'Complete') {
      req.body.completedAt = Date.now();
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to delete this task`, 401)
      );
    }

    await task.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};