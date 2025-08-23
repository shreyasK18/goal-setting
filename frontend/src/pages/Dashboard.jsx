import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import GoalForm from '../components/GoalForm'
import GoalItem from '../components/GoalItem'
import Spinner from '../components/Spinner'
import { getGoals, getGoalStats, reset } from '../features/goals/goalSlice'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: ''
  })

  const { user } = useSelector((state) => state.auth)
  const { goals, stats, isLoading, isError, message } = useSelector(
    (state) => state.goals
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }

    dispatch(getGoals(filters))
    dispatch(getGoalStats())

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  useEffect(() => {
    dispatch(getGoals(filters))
  }, [filters, dispatch])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priority: '',
      status: ''
    })
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>Welcome {user && user.name}</h1>
        <p>Goals Dashboard</p>
        <button 
          className='btn btn-primary'
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : '+ New Goal'}
        </button>
      </section>

      {stats && (
        <section className='stats-section'>
          <div className='stats-grid'>
            <div className='stat-card'>
              <h3>{stats.total}</h3>
              <p>Total Goals</p>
            </div>
            <div className='stat-card'>
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
            <div className='stat-card'>
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
            <div className='stat-card'>
              <h3>{stats.averageProgress}%</h3>
              <p>Avg Progress</p>
            </div>
          </div>
          
          <div className='category-stats'>
            <h4>Goals by Category</h4>
            <div className='category-grid'>
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className='category-stat'>
                  <span className='category-name'>{category}</span>
                  <span className='category-count'>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showForm && <GoalForm />}

      <section className='filters-section'>
        <h3>Filter Goals</h3>
        <div className='filters'>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value=''>All Categories</option>
            <option value='Health'>Health</option>
            <option value='Career'>Career</option>
            <option value='Finance'>Finance</option>
            <option value='Learning'>Learning</option>
            <option value='Personal'>Personal</option>
            <option value='Relationships'>Relationships</option>
            <option value='Travel'>Travel</option>
            <option value='Hobbies'>Hobbies</option>
            <option value='Other'>Other</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value=''>All Priorities</option>
            <option value='High'>High</option>
            <option value='Medium'>Medium</option>
            <option value='Low'>Low</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value=''>All Statuses</option>
            <option value='Not Started'>Not Started</option>
            <option value='In Progress'>In Progress</option>
            <option value='On Hold'>On Hold</option>
            <option value='Completed'>Completed</option>
            <option value='Cancelled'>Cancelled</option>
          </select>

          <button className='btn btn-secondary' onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      <section className='content'>
        {goals.length > 0 ? (
          <div className='goals'>
            {goals.map((goal) => (
              <GoalItem key={goal._id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className='no-goals'>
            <h3>No goals found</h3>
            <p>
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters or create a new goal.' 
                : 'Create your first goal to get started!'
              }
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default Dashboard
