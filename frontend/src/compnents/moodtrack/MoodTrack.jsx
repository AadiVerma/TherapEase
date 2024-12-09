import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  PieChart, 
  BarChart2, 
  Clock, 
  Smile, 
  Frown, 
  Meh, 
  Sun, 
  Book,
  Activity,
  Users
} from 'lucide-react';
import { PieChart as RechartPieChart, Pie, Cell, Tooltip } from 'recharts';
import MoodInsights from './MoodInsights';
import MoodTriggers from './MoodTriggers';
import Navbar from '../navbar/Navbar';

// Constants
const MOODS = [
  { 
    id: 'elated', 
    label: 'Elated', 
    icon: <Smile className="text-green-500" />, 
    color: 'bg-green-100',
    chartColor: '#10B981' 
  },
  { 
    id: 'happy', 
    label: 'Happy', 
    icon: <Smile className="text-lime-500" />, 
    color: 'bg-lime-100',
    chartColor: '#84CC16' 
  },
  { 
    id: 'neutral', 
    label: 'Neutral', 
    icon: <Meh className="text-gray-500" />, 
    color: 'bg-gray-100',
    chartColor: '#6B7280' 
  },
  { 
    id: 'sad', 
    label: 'Sad', 
    icon: <Frown className="text-blue-500" />, 
    color: 'bg-blue-100',
    chartColor: '#3B82F6' 
  },
  { 
    id: 'depressed', 
    label: 'Depressed', 
    icon: <Frown className="text-red-500" />, 
    color: 'bg-red-100',
    chartColor: '#EF4444' 
  }
];

const ACTIVITIES = [
  { id: 'exercise', label: 'Exercise', icon: <Activity className="text-green-600" /> },
  { id: 'work', label: 'Work', icon: <Clock className="text-blue-600" /> },
  { id: 'social', label: 'Social', icon: <Users className="text-purple-600" /> },
  { id: 'relaxation', label: 'Relaxation', icon: <Sun className="text-yellow-600" /> },
  { id: 'learning', label: 'Learning', icon: <Book className="text-indigo-600" /> }
];

const MoodTrack = () => {
  // State Management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [notes, setNotes] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodStatistics, setMoodStatistics] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Authentication (replace with your actual auth mechanism)
  const username = localStorage.getItem('tokenUser') || 'testuser';

  // Fetch Mood Data
  useEffect(() => {
    fetchMoodData();
  }, [currentMonth, username]);

  // Fetch Mood Data Function
  const fetchMoodData = async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const response = await axios.get(`http://localhost:8080/api/moods/${username}`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });

      setMoodHistory(response.data.moods);
      setMoodStatistics(response.data.statistics);
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setError('Failed to load mood data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get Mood Color for Calendar
  const getMoodColor = (mood) => {
    const moodConfig = MOODS.find(m => m.id === mood?.id);
    return moodConfig ? moodConfig.color : '';
  };

  // Open Modal for Specific Date
  const openDetailsModal = (date) => {
    setSelectedDate(date);
    
    const existingEntry = moodHistory.find(entry => 
      new Date(entry.date).toDateString() === date.toDateString()
    );

    if (existingEntry) {
      setSelectedMood(existingEntry.mood);
      setSelectedActivities(existingEntry.activities);
      setNotes(existingEntry.notes || '');
    } else {
      resetModalState();
    }

    setIsDetailsModalOpen(true);
  };

  // Reset Modal State
  const resetModalState = () => {
    setSelectedMood(null);
    setSelectedActivities([]);
    setNotes('');
  };

  // Save Mood Entry
  const saveEntry = async () => {
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }

    try {
      const entryData = {
        date: selectedDate.toISOString(),
        mood: selectedMood,
        activities: selectedActivities,
        notes: notes,
        intensity: 3
      };

      await axios.post(`http://localhost:8080/api/moods/${username}`, entryData);
      
      fetchMoodData();
      setIsDetailsModalOpen(false);
      resetModalState();
      alert('Mood entry saved successfully');
    } catch (error) {
      console.error('Error saving mood entry:', error);
      alert('Failed to save mood entry');
    }
  };

  // Toggle Activity Selection
  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.some(a => a.id === activity.id)
        ? prev.filter(a => a.id !== activity.id)
        : [...prev, activity]
    );
  };

  // Navigate Between Months
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Prepare Mood Statistics for Charts
  const prepareMoodPieData = () => {
    return moodStatistics.map(stat => {
      const mood = MOODS.find(m => m.id === stat.moodId);
      return {
        name: mood?.label || stat.moodId,
        value: stat.count,
        color: mood?.chartColor || '#000'
      };
    });
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-center">
          <h2 className="text-2xl text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchMoodData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar/>
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold">Mood Journal</h1>
          <p className="text-blue-100">Track your emotional wellness journey</p>
        </div>

        {/* Calendar and Mood Entry */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Calendar Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => navigateMonth(-1)}
                className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              >
                <ChevronLeft />
              </button>
              <h2 className="text-xl font-semibold">
                {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button 
                onClick={() => navigateMonth(1)}
                className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              >
                <ChevronRight />
              </button>
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {[...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate())].map((_, i) => {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                const moodEntry = moodHistory.find(entry => 
                  new Date(entry.date).toDateString() === date.toDateString()
                );
                
                return (
                  <button 
                    key={i} 
                    onClick={() => openDetailsModal(date)}
                    className={`
                      p-2 rounded hover:bg-blue-100 transition 
                      ${moodEntry ? getMoodColor(moodEntry.mood) : ''}
                    `}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mood Statistics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mood Overview</h2>
              <div className="flex space-x-2">
                <PieChart className="text-blue-500" />
                <BarChart2 className="text-purple-500" />
              </div>
            </div>
            {/* Mood Charts */}
            <div className="bg-white rounded-lg p-4 flex justify-center">
              <RechartPieChart width={300} height={250}>
                <Pie
                  data={prepareMoodPieData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {prepareMoodPieData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </RechartPieChart>
            </div>
          </div>
        </div>

        {/* Mood Entry Modal */}
        {isDetailsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                How are you feeling on {selectedDate.toLocaleDateString()}?
              </h2>

              {/* Mood Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Your Mood</h3>
                <div className="flex justify-between space-x-2">
                  {MOODS.map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood)}
                      className={`
                        p-3 rounded-lg transition transform 
                        ${selectedMood?.id === mood.id ? 'ring-4 ring-blue-500 scale-110' : 'hover:bg-gray-100'}
                        ${mood.color}
                      `}
                    >
                      {mood.icon}
                      <span className="block text-xs mt-1">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Activities Today</h3>
                <div className="grid grid-cols-3 gap-2">
                  {ACTIVITIES.map(activity => (
                    <button
                      key={activity.id}
                      onClick={() => toggleActivity(activity)}
                      className={`
                        p-3 rounded-lg flex flex-col items-center
                        ${selectedActivities.some(a => a.id === activity.id) 
                          ? 'bg-blue-100 ring-2 ring-blue-500' 
                          : 'hover:bg-gray-100'}
                      `}
                    >
                      {activity.icon}
                      <span className="text-xs mt-1">{activity.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Journal Entry</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write about your day..."
                  className="w-full p-3 border rounded-lg h-24"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveEntry}
                  disabled={!selectedMood}
                  className={`
                    px-6 py-2 rounded-lg 
                    ${selectedMood 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTrack;