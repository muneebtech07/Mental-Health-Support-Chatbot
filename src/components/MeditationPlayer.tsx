import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import type { MeditationSession } from '../types';

interface MeditationPlayerProps {
  session: MeditationSession;
  onComplete: () => void;
}

export function MeditationPlayer({ session, onComplete }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Changed initial state to false
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleCanPlay = () => {
        setIsLoading(false);
        setAudioError(false);
      };

      const handleError = () => {
        setIsLoading(false);
        setAudioError(true);
        setIsPlaying(false);
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [session.audioUrl]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          
          const nextStep = session.guidedSteps.findIndex(
            step => step.timestamp > audioRef.current!.currentTime
          );
          if (nextStep !== -1 && nextStep !== currentStep) {
            setCurrentStep(nextStep - 1);
          }
        }
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying, session.guidedSteps]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          setIsLoading(true);  // Set loading when starting to play
          await audioRef.current.play();
          setIsPlaying(true);
          setIsLoading(false);  // Clear loading after play starts
        }
      } catch (error) {
        console.error('Audio playback error:', error);
        setAudioError(true);
        setIsPlaying(false);
        setIsLoading(false);  // Clear loading on error
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-amber-600 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-semibold">Audio Unavailable</h2>
        </div>
        <p className="text-gray-600 mb-4">
          We're having trouble playing the meditation audio. You can still follow along with the written instructions:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Meditation Steps</h3>
          <div className="space-y-4">
            {session.guidedSteps.map((step, index) => (
              <div key={index} className="p-2">
                {step.instruction}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{session.title}</h2>
      
      <div className="mb-6">
        <p className="text-gray-600">{session.guidedSteps[currentStep]?.instruction}</p>
      </div>

      <div className="space-y-4">
        <audio
          ref={audioRef}
          src={session.audioUrl}
          onEnded={onComplete}
          preload="auto"
          className="hidden"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
            )}
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={session.duration * 60}
              value={currentTime}
              onChange={(e) => {
                const time = Number(e.target.value);
                if (audioRef.current) {
                  audioRef.current.currentTime = time;
                  setCurrentTime(time);
                }
              }}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(session.duration * 60)}</span>
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Session Progress</h3>
          <div className="space-y-2">
            {session.guidedSteps.map((step, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  index === currentStep
                    ? 'bg-indigo-100 text-indigo-800'
                    : index < currentStep
                    ? 'text-gray-400'
                    : ''
                }`}
              >
                {step.instruction}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}