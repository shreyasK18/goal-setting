const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const { category, priority, status } = req.query
  
  let filter = { user: req.user.id }
  
  // Add filters if provided
  if (category) filter.category = category
  if (priority) filter.priority = priority
  if (status) filter.status = status
  
  const goals = await Goal.find(filter).sort({ priority: -1, endDate: 1 })

  res.status(200).json(goals)
})

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  // Check for user authorization
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  res.status(200).json(goal)
})

// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  const {
    title,
    shortDescription,
    longDescription,
    category,
    priority,
    startDate,
    endDate,
    deadlineFlexibility,
    milestones,
    smartAttributes,
    text // For backward compatibility
  } = req.body

  // Validation for required fields
  if (!title && !text) {
    res.status(400)
    throw new Error('Please provide a goal title')
  }

  if (!shortDescription && !text) {
    res.status(400)
    throw new Error('Please provide a short description')
  }

  if (!category) {
    res.status(400)
    throw new Error('Please select a category')
  }

  if (!startDate || !endDate) {
    res.status(400)
    throw new Error('Please provide start and end dates')
  }

  // Create goal object
  const goalData = {
    user: req.user.id,
    title: title || text,
    shortDescription: shortDescription || text,
    longDescription: longDescription || '',
    category,
    priority: priority || 'Medium',
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    deadlineFlexibility: deadlineFlexibility || 'Soft',
    milestones: milestones || [],
    smartAttributes: smartAttributes || {},
  }

  // Add legacy text field for backward compatibility
  if (text) {
    goalData.text = text
  }

  const goal = await Goal.create(goalData)

  res.status(201).json(goal)
})

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // Handle date updates
  if (req.body.startDate) {
    req.body.startDate = new Date(req.body.startDate)
  }
  if (req.body.endDate) {
    req.body.endDate = new Date(req.body.endDate)
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json(updatedGoal)
})

// @desc    Update goal status
// @route   PUT /api/goals/:id/status
// @access  Private
const updateGoalStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  goal.status = status
  if (status === 'Completed') {
    goal.completedAt = new Date()
    goal.progress = 100
  }

  await goal.save()

  res.status(200).json(goal)
})

// @desc    Add milestone to goal
// @route   POST /api/goals/:id/milestones
// @access  Private
const addMilestone = asyncHandler(async (req, res) => {
  const { title, description, dueDate } = req.body
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  if (!title) {
    res.status(400)
    throw new Error('Milestone title is required')
  }

  const milestone = {
    title,
    description: description || '',
    dueDate: dueDate ? new Date(dueDate) : undefined,
  }

  goal.milestones.push(milestone)
  await goal.save()

  res.status(201).json(goal)
})

// @desc    Update milestone
// @route   PUT /api/goals/:id/milestones/:milestoneId
// @access  Private
const updateMilestone = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const milestone = goal.milestones.id(req.params.milestoneId)
  if (!milestone) {
    res.status(404)
    throw new Error('Milestone not found')
  }

  // Update milestone fields
  Object.keys(req.body).forEach(key => {
    if (key === 'dueDate' && req.body[key]) {
      milestone[key] = new Date(req.body[key])
    } else if (key === 'completed' && req.body[key]) {
      milestone[key] = req.body[key]
      milestone.completedAt = new Date()
    } else {
      milestone[key] = req.body[key]
    }
  })

  await goal.save()

  res.status(200).json(goal)
})

// @desc    Delete milestone
// @route   DELETE /api/goals/:id/milestones/:milestoneId
// @access  Private
const deleteMilestone = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  goal.milestones.pull(req.params.milestoneId)
  await goal.save()

  res.status(200).json(goal)
})

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await goal.deleteOne()

  res.status(200).json({ id: req.params.id })
})

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access  Private
const getGoalStats = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id })
  
  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'Completed').length,
    inProgress: goals.filter(g => g.status === 'In Progress').length,
    notStarted: goals.filter(g => g.status === 'Not Started').length,
    onHold: goals.filter(g => g.status === 'On Hold').length,
    byCategory: {},
    byPriority: {
      High: goals.filter(g => g.priority === 'High').length,
      Medium: goals.filter(g => g.priority === 'Medium').length,
      Low: goals.filter(g => g.priority === 'Low').length,
    },
    averageProgress: goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0,
  }

  // Calculate category statistics
  goals.forEach(goal => {
    stats.byCategory[goal.category] = (stats.byCategory[goal.category] || 0) + 1
  })

  res.status(200).json(stats)
})

module.exports = {
  getGoals,
  getGoal,
  setGoal,
  updateGoal,
  updateGoalStatus,
  deleteGoal,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  getGoalStats,
}
