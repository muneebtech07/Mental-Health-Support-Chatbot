import React from 'react';
import type { MoodEntry } from '../types';

interface ProgressProps {
  moodEntries: MoodEntry[];
}

export function Progress({ moodEntries }: ProgressProps) {
  const moodColors = {
    1: '#ef4444',
    2: '#f97316',
    3: '#fb923c',
    4: '#9ca3af',
    5: '#86efac',
    6: '#06b6d4',
    7: '#3b82f6',
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Mood History</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-64 flex items-end justify-between">
          {moodEntries.slice(-14).map((entry) => (
            <div
              key={entry.id}
              className="w-8 relative group"
              style={{
                height: `${(entry.value / 7) * 100}%`,
                backgroundColor: moodColors[entry.value],
              }}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(entry.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}