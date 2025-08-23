const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Goal = require('../models/goalModel');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Migration function to update existing goals
const migrateGoals = async () => {
  try {
    console.log('Starting goal migration...');
    
    // Find all goals that need migration (have text but no title)
    const goalsToMigrate = await Goal.find({
      $or: [
        { title: { $exists: false } },
        { title: null },
        { title: '' }
      ],
      text: { $exists: true, $ne: null, $ne: '' }
    });

    console.log(`Found ${goalsToMigrate.length} goals to migrate`);

    for (let goal of goalsToMigrate) {
      const updateData = {};

      // Set title from text if missing
      if (!goal.title && goal.text) {
        updateData.title = goal.text;
      }

      // Set shortDescription from text if missing
      if (!goal.shortDescription && goal.text) {
        updateData.shortDescription = goal.text.substring(0, 200);
      }

      // Set default category if missing
      if (!goal.category) {
        updateData.category = 'Personal';
      }

      // Set default priority if missing
      if (!goal.priority) {
        updateData.priority = 'Medium';
      }

      // Set default dates if missing
      if (!goal.startDate) {
        updateData.startDate = goal.createdAt || new Date();
      }

      if (!goal.endDate) {
        // Set end date to 30 days from start date
        const startDate = goal.startDate || goal.createdAt || new Date();
        updateData.endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      }

      // Set default deadline flexibility if missing
      if (!goal.deadlineFlexibility) {
        updateData.deadlineFlexibility = 'Soft';
      }

      // Set default status if missing
      if (!goal.status) {
        updateData.status = 'Not Started';
      }

      // Set default progress if missing
      if (goal.progress === undefined || goal.progress === null) {
        updateData.progress = 0;
      }

      // Initialize empty milestones array if missing
      if (!goal.milestones) {
        updateData.milestones = [];
      }

      // Initialize empty smartAttributes if missing
      if (!goal.smartAttributes) {
        updateData.smartAttributes = {
          specific: '',
          measurable: '',
          achievable: '',
          relevant: '',
          timeBound: ''
        };
      }

      // Update the goal
      await Goal.findByIdAndUpdate(goal._id, updateData, { new: true });
      console.log(`Migrated goal: ${goal._id} - "${goal.text}"`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await migrateGoals();
  process.exit(0);
};

// Check if script is run directly
if (require.main === module) {
  runMigration();
}

module.exports = { migrateGoals };
