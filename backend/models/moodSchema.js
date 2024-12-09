import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mood: {
    id: {
      type: String,
      required: true,
      enum: ['elated', 'happy', 'neutral', 'sad', 'depressed']
    },
    label: {
      type: String,
      required: true
    }
  },
  activities: [{
    id: {
      type: String,
      enum: ['exercise', 'work', 'social', 'relaxation', 'learning']
    },
    label: String
  }],
  notes: {
    type: String,
    default: ''
  },
  intensity: {
    type: Number,
    default: 3,
    min: 1,
    max: 5
  }
}, { timestamps: true });

export default mongoose.model('Mood', moodSchema);