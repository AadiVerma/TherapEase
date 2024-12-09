import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  Edit 
} from 'lucide-react';

const MoodTriggers = ({ username }) => {
  const [triggers, setTriggers] = useState([]);
  const [newTrigger, setNewTrigger] = useState('');
  const [editingTrigger, setEditingTrigger] = useState(null);

  useEffect(() => {
    fetchMoodTriggers();
  }, [username]);

  const fetchMoodTriggers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/mood-triggers/${username}`);
      setTriggers(response.data);
    } catch (error) {
      console.error('Error fetching mood triggers:', error);
    }
  };

  const addTrigger = async () => {
    if (!newTrigger.trim()) return;

    try {
      const response = await axios.post(`http://localhost:8000/api/mood-triggers/${username}`, {
        description: newTrigger,
        type: 'custom' // could be positive or negative
      });
      
      setTriggers([...triggers, response.data]);
      setNewTrigger('');
    } catch (error) {
      console.error('Error adding trigger:', error);
    }
  };

  const deleteTrigger = async (triggerId) => {
    try {
      await axios.delete(`http://localhost:8000/api/mood-triggers/${triggerId}`);
      setTriggers(triggers.filter(trigger => trigger._id !== triggerId));
    } catch (error) {
      console.error('Error deleting trigger:', error);
    }
  };

  const updateTrigger = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/mood-triggers/${editingTrigger._id}`, {
        description: editingTrigger.description
      });
      
      setTriggers(triggers.map(trigger => 
        trigger._id === editingTrigger._id ? response.data : trigger
      ));
      setEditingTrigger(null);
    } catch (error) {
      console.error('Error updating trigger:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mood Triggers</h2>
      
      {/* Add Trigger Input */}
      <div className="flex mb-4">
        <input
          type="text"
          value={newTrigger}
          onChange={(e) => setNewTrigger(e.target.value)}
          placeholder="Add a new mood trigger"
          className="flex-grow p-2 border rounded-l-lg"
        />
        <button 
          onClick={addTrigger}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
        >
          <Plus />
        </button>
      </div>

      {/* Triggers List */}
      <div className="space-y-2">
        {triggers.map((trigger) => (
          <div 
            key={trigger._id} 
            className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
          >
            {editingTrigger?._id === trigger._id ? (
              <input
                type="text"
                value={editingTrigger.description}
                onChange={(e) => setEditingTrigger({
                  ...editingTrigger,
                  description: e.target.value
                })}
                className="flex-grow p-1 border rounded"
              />
            ) : (
              <span>{trigger.description}</span>
            )}
            
            <div className="flex space-x-2">
              {editingTrigger?._id === trigger._id ? (
                <button 
                  onClick={updateTrigger}
                  className="text-green-500 hover:text-green-600"
                >
                  Save
                </button>
              ) : (
                <button 
                  onClick={() => setEditingTrigger(trigger)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Edit size={20} />
                </button>
              )}
              <button 
                onClick={() => deleteTrigger(trigger._id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTriggers;