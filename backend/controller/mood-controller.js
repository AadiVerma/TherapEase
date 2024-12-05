

import Mood from '../models/moodSchema.js';
import User from '../models/userModel.js'; // Assuming you have a user model

export const getMoods = async (req, res) => {
  try {
    const { username } = req.params;
    const { startDate, endDate } = req.query;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build query
    const query = { 
      user: user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    // Fetch moods
    const moods = await Mood.find(query).sort({ date: -1 });

    // Compute mood statistics
    const statistics = await Mood.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$mood.id',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      {
        $project: {
          moodId: '$_id',
          count: 1,
          avgIntensity: { $round: ['$avgIntensity', 2] }
        }
      }
    ]);

    res.json({ moods, statistics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMood = async (req, res) => {
  try {
    const { username } = req.params;
    const { 
      date, 
      mood, 
      activities = [], 
      notes = '', 
      intensity = 3 
    } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing mood on the same date
    const existingMood = await Mood.findOneAndUpdate(
      { 
        user: user._id, 
        date: new Date(date) 
      },
      {
        user: user._id,
        date: new Date(date),
        mood,
        activities,
        notes,
        intensity
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    res.status(201).json(existingMood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedMood = await Mood.findByIdAndDelete(id);
    
    if (!deletedMood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getMoods, createMood, deleteMood };