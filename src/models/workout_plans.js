const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { goals } = require('../config/enums');

const WorkoutPlan = new Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goal: {
        type: String,
        enum: goals,
        required: true
    },
    daysPerWeek: {
        type: Number,
        required: true,
        min: 1,
        max: 7
    }
}, {
    timestamps: true  // This automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('WorkoutPlan', WorkoutPlan);