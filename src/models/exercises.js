const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    workoutPlanId: {
        type: Schema.Types.ObjectId,
        ref: 'WorkoutPlan',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true,
        min: 1
    },
    reps: {
        type: Number,
        required: true,
        min: 1
    },
    restPeriod: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    day: {
        type: String,
        required: true
    }
}, {
    timestamps: true  // This automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
