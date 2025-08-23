const mongoose = require('mongoose')

// Milestone sub-schema for breaking goals into smaller steps
const milestoneSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
  },
  description: {
    type: String,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
})

// SMART attributes sub-schema
const smartAttributesSchema = mongoose.Schema({
  specific: {
    type: String,
    default: '',
  },
  measurable: {
    type: String,
    default: '',
  },
  achievable: {
    type: String,
    default: '',
  },
  relevant: {
    type: String,
    default: '',
  },
  timeBound: {
    type: String,
    default: '',
  },
})

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Legacy field for backward compatibility
    text: {
      type: String,
    },
    // New comprehensive fields
    title: {
      type: String,
      required: [true, 'Goal title is required'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    longDescription: {
      type: String,
      default: '',
      maxlength: [2000, 'Long description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Health', 'Career', 'Finance', 'Learning', 'Personal', 'Relationships', 'Travel', 'Hobbies', 'Other'],
    },
    priority: {
      type: String,
      required: [true, 'Priority level is required'],
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    deadlineFlexibility: {
      type: String,
      required: [true, 'Deadline flexibility is required'],
      enum: ['Hard', 'Soft'],
      default: 'Soft',
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
      default: 'Not Started',
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    milestones: [milestoneSchema],
    smartAttributes: smartAttributesSchema,
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Virtual to calculate milestone completion percentage
goalSchema.virtual('milestoneProgress').get(function() {
  if (this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(m => m.completed).length;
  return Math.round((completed / this.milestones.length) * 100);
});

// Pre-save middleware to update progress based on milestones
goalSchema.pre('save', function(next) {
  if (this.milestones.length > 0) {
    const completed = this.milestones.filter(m => m.completed).length;
    this.progress = Math.round((completed / this.milestones.length) * 100);
    
    if (this.progress === 100 && this.status !== 'Completed') {
      this.status = 'Completed';
      this.completedAt = new Date();
    } else if (this.progress > 0 && this.status === 'Not Started') {
      this.status = 'In Progress';
    }
  }
  next();
});

// Validation for date logic
goalSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Goal', goalSchema)
