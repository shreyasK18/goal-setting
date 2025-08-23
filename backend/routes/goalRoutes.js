const express = require('express')
const router = express.Router()
const {
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
} = require('../controllers/goalController')

const { protect } = require('../middleware/authMiddleware')

// Goal routes
router.route('/').get(protect, getGoals).post(protect, setGoal)
router.route('/stats').get(protect, getGoalStats)
router.route('/:id').get(protect, getGoal).delete(protect, deleteGoal).put(protect, updateGoal)
router.route('/:id/status').put(protect, updateGoalStatus)

// Milestone routes
router.route('/:id/milestones').post(protect, addMilestone)
router.route('/:id/milestones/:milestoneId').put(protect, updateMilestone).delete(protect, deleteMilestone)

module.exports = router
