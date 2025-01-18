import React from 'react';
import { Timer, Brain, Wind, Activity } from 'lucide-react';
import type { Exercise } from '../types';

interface ExercisesProps {
  exercises: Exercise[];
  onStartExercise: (exercise: Exercise) => void;
}

export function Exercises({ exercises, onStartExercise }: ExercisesProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mindfulness':
        return Brain;
      case 'breathing':
        return Wind;
      case 'physical':
      case 'relaxation':
        return Activity;
      default:
        return Brain;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Exercises</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => {
          const TypeIcon = getTypeIcon(exercise.type);
          return (
            <div
              key={exercise.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={exercise.imageUrl}
                alt={exercise.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{exercise.title}</h3>
                  <span className="flex items-center text-gray-600">
                    <Timer size={16} className="mr-1" />
                    {exercise.duration} min
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center text-gray-600">
                    <TypeIcon size={16} className="mr-1" />
                    {exercise.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>
                <button
                  onClick={() => onStartExercise(exercise)}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Start Exercise
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}