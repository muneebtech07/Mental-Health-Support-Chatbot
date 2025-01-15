import React, { useState, useEffect } from 'react';
import { Brain, Plus, X } from 'lucide-react';
import type { ThoughtRecord as ThoughtRecordType } from '../types';

interface ThoughtRecordProps {
  onSave: (record: ThoughtRecordType) => void;
  onClose: () => void;
  initialData?: ThoughtRecordType | null;
}

export function ThoughtRecord({ onSave, onClose, initialData }: ThoughtRecordProps) {
  const [situation, setSituation] = useState('');
  const [automaticThoughts, setAutomaticThoughts] = useState<string[]>([]);
  const [newThought, setNewThought] = useState('');
  const [emotions, setEmotions] = useState<{ name: string; intensity: number }[]>([]);
  const [newEmotion, setNewEmotion] = useState({ name: '', intensity: 50 });
  const [evidenceFor, setEvidenceFor] = useState<string[]>([]);
  const [evidenceAgainst, setEvidenceAgainst] = useState<string[]>([]);
  const [balancedThought, setBalancedThought] = useState('');

  useEffect(() => {
    if (initialData) {
      setSituation(initialData.situation);
      setAutomaticThoughts(initialData.automaticThoughts);
      setEmotions(initialData.emotions);
      setEvidenceFor(initialData.evidenceFor);
      setEvidenceAgainst(initialData.evidenceAgainst);
      setBalancedThought(initialData.balancedThought);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (situation && automaticThoughts.length > 0) {
      onSave({
        id: initialData?.id || Date.now().toString(),
        timestamp: initialData?.timestamp || new Date(),
        situation,
        automaticThoughts,
        emotions,
        evidenceFor,
        evidenceAgainst,
        balancedThought,
        newEmotions: emotions.map(e => ({ ...e, intensity: Math.max(0, e.intensity - 20) }))
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Thought Record</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Situation
            </label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="What happened? When? Where? Who with?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Automatic Thoughts
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newThought}
                onChange={(e) => setNewThought(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="What went through your mind?"
              />
              <button
                type="button"
                onClick={() => {
                  if (newThought) {
                    setAutomaticThoughts([...automaticThoughts, newThought]);
                    setNewThought('');
                  }
                }}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {automaticThoughts.map((thought, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                  <span className="flex-1">{thought}</span>
                  <button
                    type="button"
                    onClick={() => setAutomaticThoughts(automaticThoughts.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emotions
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newEmotion.name}
                onChange={(e) => setNewEmotion({ ...newEmotion, name: e.target.value })}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Emotion name"
              />
              <input
                type="number"
                value={newEmotion.intensity}
                onChange={(e) => setNewEmotion({ ...newEmotion, intensity: Number(e.target.value) })}
                className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0"
                max="100"
              />
              <button
                type="button"
                onClick={() => {
                  if (newEmotion.name) {
                    setEmotions([...emotions, newEmotion]);
                    setNewEmotion({ name: '', intensity: 50 });
                  }
                }}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emotion, index) => (
                <div key={index} className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                  <span>{emotion.name} ({emotion.intensity}%)</span>
                  <button
                    type="button"
                    onClick={() => setEmotions(emotions.filter((_, i) => i !== index))}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence Supporting
              </label>
              <textarea
                value={evidenceFor.join('\n')}
                onChange={(e) => setEvidenceFor(e.target.value.split('\n').filter(Boolean))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="What supports this thought?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence Against
              </label>
              <textarea
                value={evidenceAgainst.join('\n')}
                onChange={(e) => setEvidenceAgainst(e.target.value.split('\n').filter(Boolean))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="What doesn't support this thought?"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balanced Thought
            </label>
            <textarea
              value={balancedThought}
              onChange={(e) => setBalancedThought(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="What's a more balanced way to think about this?"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}