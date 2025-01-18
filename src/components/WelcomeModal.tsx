import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Mood } from '../types';
import { MoodTracker } from './MoodTracker';

interface WelcomeModalProps {
  onMoodSelect?: (mood: Mood) => void;
}

export function WelcomeModal({ onMoodSelect }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    if (hasSeenModal) {
      setIsOpen(false);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">How are you feeling?</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <MoodTracker
          onMoodSelect={(mood, details) => {
            if (onMoodSelect) {
              onMoodSelect(mood);
            }
            handleClose();
          }}
        />
      </div>
    </div>
  );
}