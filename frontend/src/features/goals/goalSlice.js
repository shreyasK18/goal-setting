import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import goalService from './goalService'

const initialState = {
  goals: [],
  currentGoal: null,
  stats: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Create new goal
export const createGoal = createAsyncThunk(
  'goals/create',
  async (goalData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.createGoal(goalData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user goals
export const getGoals = createAsyncThunk(
  'goals/getAll',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.getGoals(filters, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single goal
export const getGoal = createAsyncThunk(
  'goals/getOne',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.getGoal(id, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update goal
export const updateGoal = createAsyncThunk(
  'goals/update',
  async ({ id, goalData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.updateGoal(id, goalData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update goal status
export const updateGoalStatus = createAsyncThunk(
  'goals/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.updateGoalStatus(id, status, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Add milestone
export const addMilestone = createAsyncThunk(
  'goals/addMilestone',
  async ({ goalId, milestoneData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.addMilestone(goalId, milestoneData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update milestone
export const updateMilestone = createAsyncThunk(
  'goals/updateMilestone',
  async ({ goalId, milestoneId, milestoneData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.updateMilestone(goalId, milestoneId, milestoneData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete milestone
export const deleteMilestone = createAsyncThunk(
  'goals/deleteMilestone',
  async ({ goalId, milestoneId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.deleteMilestone(goalId, milestoneId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete user goal
export const deleteGoal = createAsyncThunk(
  'goals/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.deleteGoal(id, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get goal statistics
export const getGoalStats = createAsyncThunk(
  'goals/getStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await goalService.getGoalStats(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    reset: (state) => initialState,
    clearCurrentGoal: (state) => {
      state.currentGoal = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.goals.push(action.payload)
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getGoals.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.goals = action.payload
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getGoal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGoal.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentGoal = action.payload
      })
      .addCase(getGoal.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateGoal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const index = state.goals.findIndex(goal => goal._id === action.payload._id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
        state.currentGoal = action.payload
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateGoalStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const index = state.goals.findIndex(goal => goal._id === action.payload._id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
      .addCase(addMilestone.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const index = state.goals.findIndex(goal => goal._id === action.payload._id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
        state.currentGoal = action.payload
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const index = state.goals.findIndex(goal => goal._id === action.payload._id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
        state.currentGoal = action.payload
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const index = state.goals.findIndex(goal => goal._id === action.payload._id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
        state.currentGoal = action.payload
      })
      .addCase(deleteGoal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.goals = state.goals.filter(
          (goal) => goal._id !== action.payload.id
        )
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getGoalStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stats = action.payload
      })
  },
})

export const { reset, clearCurrentGoal } = goalSlice.actions
export default goalSlice.reducer
