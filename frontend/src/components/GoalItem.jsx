import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteGoal, updateGoalStatus, addMilestone, updateMilestone, deleteMilestone } from '../features/goals/goalSlice'

function GoalItem({ goal }) {
  const dispatch = useDispatch()
  const [showDetails, setShowDetails] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', dueDate: '' })
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)

  const handleStatusChange = (newStatus) => {
    dispatch(updateGoalStatus({ id: goal._id, status: newStatus }))
  }

  const handleMilestoneToggle = (milestoneId, completed) => {
    dispatch(updateMilestone({ 
      goalId: goal._id, 
      milestoneId, 
      milestoneData: { completed: !completed }
    }))
  }

  const handleAddMilestone = (e) => {
    e.preventDefault()
    if (!newMilestone.title) return
    
    dispatch(addMilestone({ goalId: goal._id, milestoneData: newMilestone }))
    setNewMilestone({ title: '', description: '', dueDate: '' })
    setShowMilestoneForm(false)
  }

  const handleDeleteMilestone = (milestoneId) => {
    dispatch(deleteMilestone({ goalId: goal._id, milestoneId }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ff4757'
      case 'Medium': return '#ffa502'
      case 'Low': return '#2ed573'
      default: return '#747d8c'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#2ed573'
      case 'In Progress': return '#3742fa'
      case 'On Hold': return '#ffa502'
      case 'Cancelled': return '#ff4757'
      default: return '#747d8c'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className='goal-card'>
      <div className='goal-header'>
        <div className='goal-title-section'>
          <h3>{goal.title || goal.text}</h3>
          <div className='goal-meta'>
            <span className='category-badge' style={{ backgroundColor: getPriorityColor(goal.priority) }}>
              {goal.category}
            </span>
            <span className='priority-badge' style={{ color: getPriorityColor(goal.priority) }}>
              {goal.priority} Priority
            </span>
            <span className='status-badge' style={{ color: getStatusColor(goal.status) }}>
              {goal.status}
            </span>
          </div>
        </div>
        <div className='goal-actions'>
          <button 
            className='btn-toggle'
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '▼' : '▶'}
          </button>
          <button 
            onClick={() => {dispatch(deleteGoal(goal._id))}} 
            className='btn-delete'
          >
            ×
          </button>
        </div>
      </div>

      <div className='goal-summary'>
        <p>{goal.shortDescription}</p>
        {goal.progress !== undefined && (
          <div className='progress-bar'>
            <div 
              className='progress-fill' 
              style={{ width: `${goal.progress}%` }}
            ></div>
            <span className='progress-text'>{goal.progress}%</span>
          </div>
        )}
      </div>

      <div className='goal-dates'>
        {goal.startDate && (
          <span>Start: {formatDate(goal.startDate)}</span>
        )}
        {goal.endDate && (
          <span>End: {formatDate(goal.endDate)}</span>
        )}
        {goal.deadlineFlexibility && (
          <span className={`deadline-type ${goal.deadlineFlexibility.toLowerCase()}`}>
            {goal.deadlineFlexibility} Deadline
          </span>
        )}
      </div>

      {showDetails && (
        <div className='goal-details'>
          {goal.longDescription && (
            <div className='goal-description'>
              <h4>Description</h4>
              <p>{goal.longDescription}</p>
            </div>
          )}

          <div className='status-controls'>
            <h4>Update Status</h4>
            <div className='status-buttons'>
              {['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled'].map(status => (
                <button
                  key={status}
                  className={`status-btn ${goal.status === status ? 'active' : ''}`}
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {goal.milestones && goal.milestones.length > 0 && (
            <div className='milestones-section'>
              <h4>Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})</h4>
              <div className='milestones-list'>
                {goal.milestones.map(milestone => (
                  <div key={milestone._id} className={`milestone ${milestone.completed ? 'completed' : ''}`}>
                    <input
                      type='checkbox'
                      checked={milestone.completed}
                      onChange={() => handleMilestoneToggle(milestone._id, milestone.completed)}
                    />
                    <div className='milestone-content'>
                      <span className='milestone-title'>{milestone.title}</span>
                      {milestone.description && (
                        <span className='milestone-desc'>{milestone.description}</span>
                      )}
                      {milestone.dueDate && (
                        <span className='milestone-date'>Due: {formatDate(milestone.dueDate)}</span>
                      )}
                    </div>
                    <button
                      className='btn-delete-milestone'
                      onClick={() => handleDeleteMilestone(milestone._id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='milestone-form-section'>
            <button
              className='btn-add-milestone'
              onClick={() => setShowMilestoneForm(!showMilestoneForm)}
            >
              {showMilestoneForm ? 'Cancel' : '+ Add Milestone'}
            </button>

            {showMilestoneForm && (
              <form onSubmit={handleAddMilestone} className='milestone-form'>
                <input
                  type='text'
                  placeholder='Milestone title'
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                  required
                />
                <input
                  type='text'
                  placeholder='Description (optional)'
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                />
                <input
                  type='date'
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})}
                />
                <button type='submit' className='btn-submit-milestone'>Add</button>
              </form>
            )}
          </div>

          {goal.smartAttributes && Object.values(goal.smartAttributes).some(val => val) && (
            <div className='smart-attributes'>
              <h4>SMART Goals Framework</h4>
              <div className='smart-grid'>
                {Object.entries(goal.smartAttributes).map(([key, value]) => (
                  value && (
                    <div key={key} className='smart-item'>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                      <span>{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          <div className='goal-timestamps'>
            <small>Created: {formatDate(goal.createdAt)}</small>
            {goal.completedAt && (
              <small>Completed: {formatDate(goal.completedAt)}</small>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalItem
