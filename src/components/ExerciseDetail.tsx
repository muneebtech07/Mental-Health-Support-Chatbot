import React, { useState } from 'react';
import { ArrowLeft, Timer, Check, Brain, Wind, Activity } from 'lucide-react';
import type { Exercise } from '../types';

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
  onComplete: (exerciseId: string) => void;
}

export function ExerciseDetail({ exercise, onBack, onComplete }: ExerciseDetailProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

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

  const TypeIcon = getTypeIcon(exercise.type);

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Exercises
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={exercise.imageUrl}
            alt={exercise.title}
            className="w-full h-64 object-cover"
          />
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">{exercise.title}</h2>
              <div className="flex items-center gap-4">
                <span className="flex items-center text-gray-600">
                  <Timer size={20} className="mr-1" />
                  {exercise.duration} min
                </span>
                <span className="flex items-center text-gray-600">
                  <TypeIcon size={20} className="mr-1" />
                  {exercise.type}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{exercise.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {exercise.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Steps</h3>
              <div className="space-y-4">
                {exercise.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      index === currentStep
                        ? 'border-indigo-500 bg-indigo-50'
                        : index < currentStep
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                        index === currentStep
                          ? 'bg-indigo-500 text-white'
                          : index < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                      }`}>
                        {index < currentStep ? <Check size={14} /> : index + 1}
                      </span>
                      <span className={index < currentStep ? 'text-gray-600' : ''}>
                        {step}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>
              {currentStep < exercise.steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Next Step
                </button>
              ) : !isCompleted && (
                <button
                  onClick={() => {
                    setIsCompleted(true);
                    onComplete(exercise.id);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Complete Exercise
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}