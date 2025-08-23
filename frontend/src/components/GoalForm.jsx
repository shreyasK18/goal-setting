import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createGoal } from '../features/goals/goalSlice'

function GoalForm() {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    category: 'Personal',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    deadlineFlexibility: 'Soft',
    smartAttributes: {
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: ''
    }
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const dispatch = useDispatch()

  const categories = ['Health', 'Career', 'Finance', 'Learning', 'Personal', 'Relationships', 'Travel', 'Hobbies', 'Other']
  const priorities = ['Low', 'Medium', 'High']

  const onChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('smart.')) {
      const smartField = name.split('.')[1]
      setFormData(prevState => ({
        ...prevState,
        smartAttributes: {
          ...prevState.smartAttributes,
          [smartField]: value
        }
      }))
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.shortDescription || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields')
      return
    }

    dispatch(createGoal(formData))
    setFormData({
      title: '',
      shortDescription: '',
      longDescription: '',
      category: 'Personal',
      priority: 'Medium',
      startDate: '',
      endDate: '',
      deadlineFlexibility: 'Soft',
      smartAttributes: {
        specific: '',
        measurable: '',
        achievable: '',
        relevant: '',
        timeBound: ''
      }
    })
    setShowAdvanced(false)
  }

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='title'>Goal Title *</label>
            <input
              type='text'
              name='title'
              id='title'
              value={formData.title}
              onChange={onChange}
              placeholder='Enter your goal title'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='category'>Category *</label>
            <select
              name='category'
              id='category'
              value={formData.category}
              onChange={onChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='form-group'>
          <label htmlFor='shortDescription'>Short Description *</label>
          <input
            type='text'
            name='shortDescription'
            id='shortDescription'
            value={formData.shortDescription}
            onChange={onChange}
            placeholder='Brief description (max 200 characters)'
            maxLength={200}
            required
          />
          <small>{formData.shortDescription.length}/200 characters</small>
        </div>

        <div className='form-group'>
          <label htmlFor='longDescription'>Detailed Description</label>
          <textarea
            name='longDescription'
            id='longDescription'
            value={formData.longDescription}
            onChange={onChange}
            placeholder='Detailed description of your goal'
            rows={3}
            maxLength={2000}
          />
          <small>{formData.longDescription.length}/2000 characters</small>
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='priority'>Priority</label>
            <select
              name='priority'
              id='priority'
              value={formData.priority}
              onChange={onChange}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='deadlineFlexibility'>Deadline Type</label>
            <select
              name='deadlineFlexibility'
              id='deadlineFlexibility'
              value={formData.deadlineFlexibility}
              onChange={onChange}
            >
              <option value='Soft'>Soft (Flexible)</option>
              <option value='Hard'>Hard (Fixed)</option>
            </select>
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='startDate'>Start Date *</label>
            <input
              type='date'
              name='startDate'
              id='startDate'
              value={formData.startDate}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='endDate'>End Date *</label>
            <input
              type='date'
              name='endDate'
              id='endDate'
              value={formData.endDate}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className='form-group'>
          <button
            type='button'
            className='btn-secondary'
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} SMART Goals Framework
          </button>
        </div>

        {showAdvanced && (
          <div className='smart-section'>
            <h4>SMART Goals Framework</h4>
            <div className='form-group'>
              <label htmlFor='smart.specific'>Specific</label>
              <input
                type='text'
                name='smart.specific'
                id='smart.specific'
                value={formData.smartAttributes.specific}
                onChange={onChange}
                placeholder='What exactly will you accomplish?'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='smart.measurable'>Measurable</label>
              <input
                type='text'
                name='smart.measurable'
                id='smart.measurable'
                value={formData.smartAttributes.measurable}
                onChange={onChange}
                placeholder='How will you measure progress?'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='smart.achievable'>Achievable</label>
              <input
                type='text'
                name='smart.achievable'
                id='smart.achievable'
                value={formData.smartAttributes.achievable}
                onChange={onChange}
                placeholder='Is this goal realistic?'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='smart.relevant'>Relevant</label>
              <input
                type='text'
                name='smart.relevant'
                id='smart.relevant'
                value={formData.smartAttributes.relevant}
                onChange={onChange}
                placeholder='Why is this goal important?'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='smart.timeBound'>Time-bound</label>
              <input
                type='text'
                name='smart.timeBound'
                id='smart.timeBound'
                value={formData.smartAttributes.timeBound}
                onChange={onChange}
                placeholder='What is the deadline?'
              />
            </div>
          </div>
        )}

        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Create Goal
          </button>
        </div>
      </form>
    </section>
  )
}

export default GoalForm
