import React, { useState } from 'react';
import { Plus, Moon, Battery, Activity, Brain, X } from 'lucide-react';
import type { Mood } from '../types';

const moodColors = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-orange-300',
  4: 'bg-gray-400',
  5: 'bg-green-300',
  6: 'bg-cyan-500',
  7: 'bg-blue-500',
};

const moodLabels = {
  1: 'Very Low',
  2: 'Low',
  3: 'Slightly Low',
  4: 'Neutral',
  5: 'Slightly Good',
  6: 'Good',
  7: 'Very Good',
};

interface MoodTrackerProps {
  onMoodSelect: (
    mood: Mood,
    details: {
      activities: string[];
      sleepHours: number;
      energyLevel: number;
      anxietyLevel: number;
      thoughts: string;
      triggers: string[];
      copingStrategies: string[];
    }
  ) => void;
  onClose: () => void;
}

export function MoodTracker({ onMoodSelect, onClose }: MoodTrackerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [thoughts, setThoughts] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<string[]>([]);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setShowDetails(true);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood, {
        activities,
        sleepHours,
        energyLevel,
        anxietyLevel,
        thoughts,
        triggers,
        copingStrategies,
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">How are you feeling?</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {(Object.keys(moodColors) as unknown as Mood[]).map((mood) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            className={`${
              moodColors[mood]
            } w-full aspect-square rounded-full hover:opacity-80 transition-opacity ${
              selectedMood === mood ? 'ring-4 ring-indigo-400' : ''
            }`}
            title={moodLabels[mood]}
          />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2 text-xs text-center">
        {(Object.keys(moodLabels) as unknown as Mood[]).map((mood) => (
          <div key={mood}>{moodLabels[mood]}</div>
        ))}
      </div>

      {showDetails && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Moon size={16} />
              Sleep Hours
            </label>
            <input
              type="range"
              min="0"
              max="12"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{sleepHours} hours</span>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Battery size={16} />
              Energy Level
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{energyLevel}/10</span>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Activity size={16} />
              Anxiety Level
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={anxietyLevel}
              onChange={(e) => setAnxietyLevel(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{anxietyLevel}/10</span>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Brain size={16} />
              Thoughts
            </label>
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Entry
          </button>
        </div>
      )}
    </div>
  );
}