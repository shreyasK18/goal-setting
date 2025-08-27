import axios from 'axios'

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:2000'}/api/goals/`

// Create new goal
const createGoal = async (goalData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, goalData, config)

  return response.data
}

// Get user goals with optional filters
const getGoals = async (filters, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filters || {},
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Get single goal
const getGoal = async (goalId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + goalId, config)

  return response.data
}

// Update goal
const updateGoal = async (goalId, goalData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + goalId, goalData, config)

  return response.data
}

// Update goal status
const updateGoalStatus = async (goalId, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + goalId + '/status', { status }, config)

  return response.data
}

// Add milestone to goal
const addMilestone = async (goalId, milestoneData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL + goalId + '/milestones', milestoneData, config)

  return response.data
}

// Update milestone
const updateMilestone = async (goalId, milestoneId, milestoneData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + goalId + '/milestones/' + milestoneId, milestoneData, config)

  return response.data
}

// Delete milestone
const deleteMilestone = async (goalId, milestoneId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + goalId + '/milestones/' + milestoneId, config)

  return response.data
}

// Delete user goal
const deleteGoal = async (goalId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + goalId, config)

  return response.data
}

// Get goal statistics
const getGoalStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + 'stats', config)

  return response.data
}

const goalService = {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  updateGoalStatus,
  deleteGoal,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  getGoalStats,
}

export default goalService
