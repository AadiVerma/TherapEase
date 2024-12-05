import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MoodInsights = ({ username }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoodInsights();
  }, [username]);

  const fetchMoodInsights = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/mood-insights/${username}`);
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching mood insights:', error);
      setError('Failed to load mood insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading insights...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!insights) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mood Insights</h2>
      
      {/* Overall Mood Trend */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center">
          {insights.overallTrend > 0 ? (
            <TrendingUp className="text-green-500 mr-2" />
          ) : (
            <TrendingDown className="text-red-500 mr-2" />
          )}
          <span>Overall Mood Trend</span>
        </div>
        <span className={`font-bold ${insights.overallTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {insights.overallTrend > 0 ? 'Improving' : 'Declining'}
        </span>
      </div>

      {/* Most Impactful Activities */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Most Impactful Activities</h3>
        <div className="space-y-2">
          {insights.mostImpactfulActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="mr-2 text-blue-500" />
                <span>{activity.name}</span>
              </div>
              <span className={`font-bold ${activity.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {activity.impact > 0 ? 'Positive' : 'Negative'} Impact
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Progression Chart */}
      <div className="h-64">
        <h3 className="text-lg font-semibold mb-3">Mood Progression</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={insights.moodProgression}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="moodScore" 
              stroke="#8884d8" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodInsights;