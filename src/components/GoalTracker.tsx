import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, X, Edit2, Trash2 } from 'lucide-react';
import type { Goal } from '../types';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalTracker({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalTrackerProps) {
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    category: 'mental',
    steps: [],
    progress: 0,
    rewards: [],
    supportNeeded: [],
    reflections: []
  });
  const [newStep, setNewStep] = useState({ description: '', deadline: '' });
  const [newReward, setNewReward] = useState('');
  const [newSupport, setNewSupport] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title && newGoal.category) {
      const goalToSave: Goal = {
        id: editingGoal?.id || Date.now().toString(),
        title: newGoal.title,
        category: newGoal.category as 'mental' | 'emotional' | 'physical' | 'social',
        steps: newGoal.steps || [],
        progress: newGoal.progress || 0,
        rewards: newGoal.rewards || [],
        supportNeeded: newGoal.supportNeeded || [],
        reflections: newGoal.reflections || []
      };

      if (editingGoal) {
        onUpdateGoal(goalToSave);
      } else {
        onAddGoal(goalToSave);
      }
      setShowNewGoal(false);
      setEditingGoal(null);
      setNewGoal({
        title: '',
        category: 'mental',
        steps: [],
        progress: 0,
        rewards: [],
        supportNeeded: [],
        reflections: []
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Goals</h2>
        <button
          onClick={() => {
            setEditingGoal(null);
            setNewGoal({
              title: '',
              category: 'mental',
              steps: [],
              progress: 0,
              rewards: [],
              supportNeeded: [],
              reflections: []
            });
            setShowNewGoal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{goal.title}</h3>
                <span className="inline-block px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded">
                  {goal.category}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingGoal(goal);
                    setNewGoal(goal);
                    setShowNewGoal(true);
                  }}
                  className="p-1 text-gray-600 hover:text-indigo-600"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Steps</h4>
                <div className="space-y-2">
                  {goal.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const updatedSteps = [...goal.steps];
                          updatedSteps[index] = {
                            ...step,
                            completed: !step.completed
                          };
                          onUpdateGoal({
                            ...goal,
                            steps: updatedSteps,
                            progress: (updatedSteps.filter(s => s.completed).length / updatedSteps.length) * 100
                          });
                        }}
                        className="text-gray-600 hover:text-indigo-600"
                      >
                        {step.completed ? (
                          <CheckCircle2 className="text-green-500" size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                      <span className={step.completed ? 'line-through text-gray-500' : ''}>
                        {step.description}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(step.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {goal.rewards.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Rewards</h4>
                  <div className="flex flex-wrap gap-2">
                    {goal.rewards.map((reward, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {goal.supportNeeded.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Support Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {goal.supportNeeded.map((support, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {support}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{Math.round(goal.progress)}% complete</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingGoal ? 'Edit Goal' : 'New Goal'}
                </h3>
                <button
                  onClick={() => {
                    setShowNewGoal(false);
                    setEditingGoal(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="mental">Mental</option>
                    <option value="emotional">Emotional</option>
                    <option value="physical">Physical</option>
                    <option value="social">Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Steps
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newStep.description}
                      onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                      placeholder="Step description"
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="date"
                      value={newStep.deadline}
                      onChange={(e) => setNewStep({ ...newStep, deadline: e.target.value })}
                      className="w-40 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newStep.description && newStep.deadline) {
                          setNewGoal({
                            ...newGoal,
                            steps: [
                              ...(newGoal.steps || []),
                              {
                                description: newStep.description,
                                deadline: new Date(newStep.deadline),
                                completed: false
                              }
                            ]
                          });
                          setNewStep({ description: '', deadline: '' });
                        }
                      }}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newGoal.steps?.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                        <span className="flex-1">{step.description}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(step.deadline).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const steps = [...(newGoal.steps || [])];
                            steps.splice(index, 1);
                            setNewGoal({ ...newGoal, steps });
                          }}
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
                    Rewards
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newReward}
                      onChange={(e) => setNewReward(e.target.value)}
                      placeholder="Add a reward"
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newReward) {
                          setNewGoal({
                            ...newGoal,
                            rewards: [...(newGoal.rewards || []), newReward]
                          });
                          setNewReward('');
                        }
                      }}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newGoal.rewards?.map((reward, index) => (
                      <div key={index} className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                        <span className="text-green-800">{reward}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const rewards = [...(newGoal.rewards || [])];
                            rewards.splice(index, 1);
                            setNewGoal({ ...newGoal, rewards });
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Needed
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSupport}
                      onChange={(e) => setNewSupport(e.target.value)}
                      placeholder="What support do you need?"
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSupport) {
                          setNewGoal({
                            ...newGoal,
                            supportNeeded: [...(newGoal.supportNeeded || []), newSupport]
                          });
                          setNewSupport('');
                        }
                      }}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newGoal.supportNeeded?.map((support, index) => (
                      <div key={index} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                        <span className="text-blue-800">{support}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const supportNeeded = [...(newGoal.supportNeeded || [])];
                            supportNeeded.splice(index, 1);
                            setNewGoal({ ...newGoal, supportNeeded });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewGoal(false);
                      setEditingGoal(null);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingGoal ? 'Update Goal' : 'Add Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}