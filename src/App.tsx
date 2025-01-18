/**
 * Main App component
 * @author MuNeeB Tech
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Edit2, Trash2, SmilePlus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { ChatHistory } from './components/ChatHistory';
import { MoodTracker } from './components/MoodTracker';
import { Exercises } from './components/Exercises';
import { Progress } from './components/Progress';
import { ThoughtRecord } from './components/ThoughtRecord';
import { MeditationPlayer } from './components/MeditationPlayer';
import { GoalTracker } from './components/GoalTracker';
import { ExerciseDetail } from './components/ExerciseDetail';
import { WelcomeModal } from './components/WelcomeModal';
import { Login } from './components/Login';
import { chatService } from './services/api';
import type { Message, Exercise, MoodEntry, Mood, ThoughtRecord as ThoughtRecordType, Goal, MeditationSession, User, ChatSession } from './types';

const initialExercises: Exercise[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    type: 'breathing',
    duration: 5,
    steps: [
      'Find a comfortable seated position',
      'Place one hand on your chest and one on your belly',
      'Inhale slowly through your nose for 4 counts',
      'Hold the breath for 4 counts',
      'Exhale slowly through your mouth for 6 counts',
      'Repeat for 5-10 cycles'
    ],
    completed: false,
    description: 'A calming breathing technique that helps reduce stress and anxiety by activating your body\'s relaxation response.',
    benefits: [
      'Reduces stress and anxiety',
      'Lowers blood pressure',
      'Improves focus and concentration',
      'Helps with emotional regulation'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80',
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Focus Reset',
    type: 'mindfulness',
    duration: 3,
    steps: [
      'Sit in a comfortable position with your back straight',
      'Close your eyes and take a deep breath in through your nose for 4 counts',
      'Exhale slowly through your mouth for 6 counts',
      'Bring your attention to your senses: notice what you hear, feel, and smell around you',
      'Continue this for 3 minutes, gently bringing your focus back if your mind starts to wander'
    ],
    completed: false,
    description: 'A quick mindfulness exercise designed to refocus your mind and bring you back to the present moment.',
    benefits: [
      'Improves mental clarity',
      'Reduces distractions',
      'Increases self-awareness',
      'Enhances emotional stability'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1840&auto=format&fit=crop',
    difficulty: 'beginner'
  },
  {
    id: '3',
    title: 'Energy Boost',
    type: 'mindfulness',
    duration: 7,
    steps: [
      'Stand up with your feet shoulder-width apart',
      'Take a deep inhale through your nose while raising your arms overhead',
      'Exhale forcefully through your mouth as you swing your arms down',
      'Repeat this movement rhythmically for 10 breaths',
      'Pause, and take a moment to notice the sensations in your body',
      'Finish with three slow, deep breaths, in through your nose and out through your mouth'
    ],
    completed: false,
    description: 'An energizing breathing exercise combined with movement to invigorate your body and mind.',
    benefits: [
      'Boosts energy levels',
      'Increases oxygen flow to the brain',
      'Releases tension in the body',
      'Improves overall mood and alertness'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'beginner'
  }
];

const sampleMeditation: MeditationSession = {
  id: '1',
  title: '11-Minute Awareness of Breath Practice',
  duration: 10,
  type: 'breathing',
  audioUrl: 'http://traffic.libsyn.com/mindfulorg/SusanKaiserGreenland.mp3',
  transcript: 'Find a comfortable position and close your eyes. Take a deep breath in through your nose, hold it for a moment, and then slowly release it through your mouth. Continue breathing deeply and naturally.',
  backgroundSound: 'ocean',
  guidedSteps: [
    { timestamp: 0, instruction: "Find a comfortable seated position and close your eyes" },
    { timestamp: 30, instruction: "Take a deep breath in through your nose, hold, and exhale through your mouth" },
    { timestamp: 60, instruction: "Bring attention to the sensation of sitting; feel the weight of your body" },
    { timestamp: 120, instruction: "Notice contact points where your body meets the chair or cushion" },
    { timestamp: 180, instruction: "Observe areas of tension; allow them to soften with each exhale" },
    { timestamp: 240, instruction: "Acknowledge arising thoughts without judgment; return focus to sitting and breathing" },
    { timestamp: 600, instruction: "Gently bring your awareness back to the room; open your eyes" }
  ]
};

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'chat';
  });
  
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('currentChat');
    return savedMessages ? JSON.parse(savedMessages, (key, value) => {
      if (key === 'timestamp') {
        return new Date(value);
      }
      return value;
    }) : [];
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chatSessions');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'timestamp' || key === 'createdAt' || key === 'lastMessageAt') {
        return new Date(value);
      }
      return value;
    }) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    return localStorage.getItem('currentSessionId');
  });

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('moodEntries');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'timestamp') {
        return new Date(value);
      }
      return value;
    }) : [];
  });

  const [exercises, setExercises] = useState(initialExercises);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecordType[]>([]);
  const [showThoughtRecord, setShowThoughtRecord] = useState(false);
  const [editingThoughtRecord, setEditingThoughtRecord] = useState<ThoughtRecordType | null>(null);
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([sampleMeditation]);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('currentChat', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('currentSessionId', currentSessionId);
    } else {
      localStorage.removeItem('currentSessionId');
    }
  }, [currentSessionId]);

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  // Handle beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length > 0) {
        saveCurrentChat();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [messages]);

  const createNewChat = () => {
    if (messages.length > 0) {
      saveCurrentChat();
    }
    setMessages([]);
    setCurrentSessionId(null);
    localStorage.removeItem('currentChat');
    localStorage.removeItem('currentSessionId');
  };

  const saveCurrentChat = () => {
    if (messages.length === 0) return;

    const firstUserMessage = messages.find(m => m.sender === 'user')?.content || 'New Chat';
    const newSession: ChatSession = {
      id: currentSessionId || Date.now().toString(),
      title: firstUserMessage.slice(0, 50) + (firstUserMessage.length > 50 ? '...' : ''),
      messages: messages,
      createdAt: new Date(),
      lastMessageAt: new Date(),
    };

    setChatSessions(prev => {
      const filtered = prev.filter(session => session.id !== newSession.id);
      return [newSession, ...filtered];
    });
  };

  const handleTabChange = (newTab: string) => {
    if (activeTab === 'chat' && messages.length > 0) {
      saveCurrentChat();
    }
    setActiveTab(newTab);
    localStorage.setItem('activeTab', newTab);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    if (activeTab === 'chat' && messages.length > 0) {
      saveCurrentChat();
    }
    setUser(null);
    localStorage.removeItem('user');
    setActiveTab('chat');
  };

  const handleSendMessage = async (content: string, context: Message[]) => {
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
        username: user?.username
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      const response = await chatService.sendMessage(content, context);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      if (messages.length === 0) {
        saveCurrentChat();
      }
    } catch (error) {
      console.error('Error getting bot response:', error);
      throw error;
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    saveCurrentChat();
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setShowChatHistory(false);
    setActiveTab('chat');
  };

  const handleDeleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  const handleMoodSelect = (
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
  ) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      value: mood,
      timestamp: new Date(),
      ...details
    };
    setMoodEntries([...moodEntries, newEntry]);
    setShowMoodTracker(false);
  };

  const handleSaveThoughtRecord = (record: ThoughtRecordType) => {
    if (editingThoughtRecord) {
      setThoughtRecords(records =>
        records.map(r => r.id === record.id ? record : r)
      );
    } else {
      setThoughtRecords(records => [...records, record]);
    }
    setShowThoughtRecord(false);
    setEditingThoughtRecord(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onShowHistory={() => setShowChatHistory(true)}
        showChatHistory={showChatHistory}
        onCloseChatHistory={() => setShowChatHistory(false)}
      />

      <main className="flex-1 flex flex-col lg:ml-20 w-full max-w-[100vw] overflow-x-hidden">
        <div className="p-4 bg-white border-b shadow-sm flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <span className="text-2xl">{user.avatar}</span>
            <span className="font-medium">{user.username}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <button
              onClick={createNewChat}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              onClick={() => setShowMoodTracker(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
            >
              <SmilePlus size={18} />
              <span className="hidden sm:inline">How are you feeling?</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 text-red-600 hover:text-red-700 text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {showChatHistory ? (
            <ChatHistory
              sessions={chatSessions}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
              onClose={() => setShowChatHistory(false)}
            />
          ) : activeTab === 'chat' ? (
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          ) : activeTab === 'exercises' && !selectedExercise ? (
            <Exercises
              exercises={exercises}
              onStartExercise={setSelectedExercise}
            />
          ) : activeTab === 'exercises' && selectedExercise ? (
            <ExerciseDetail
              exercise={selectedExercise}
              onBack={() => setSelectedExercise(null)}
              onComplete={(id) => {
                setExercises(exercises.map(ex =>
                  ex.id === id ? { ...ex, completed: true } : ex
                ));
                setSelectedExercise(null);
              }}
            />
          ) : activeTab === 'thoughts' && !showThoughtRecord ? (
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold">Thought Records</h2>
                <button
                  onClick={() => {
                    setEditingThoughtRecord(null);
                    setShowThoughtRecord(true);
                  }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
                >
                  <Plus size={18} />
                  New Record
                </button>
              </div>
            </div>
          ) : activeTab === 'thoughts' && showThoughtRecord ? (
            <ThoughtRecord
              onSave={handleSaveThoughtRecord}
              onClose={() => {
                setShowThoughtRecord(false);
                setEditingThoughtRecord(null);
              }}
              initialData={editingThoughtRecord}
            />
          ) : activeTab === 'meditation' ? (
            <MeditationPlayer
              session={selectedSession || sampleMeditation}
              onComplete={() => setSelectedSession(null)}
            />
          ) : activeTab === 'goals' ? (
            <div className="p-4 sm:p-6">
              <GoalTracker
                goals={goals}
                onAddGoal={(goal) => setGoals([...goals, goal])}
                onUpdateGoal={(goal) => setGoals(goals.map(g => g.id === goal.id ? goal : g))}
                onDeleteGoal={(id) => setGoals(goals.filter(g => g.id !== id))}
              />
            </div>
          ) : activeTab === 'progress' ? (
            <Progress moodEntries={moodEntries} />
          ) : null}
        </div>

        {showMoodTracker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
              <MoodTracker
                onMoodSelect={handleMoodSelect}
                onClose={() => setShowMoodTracker(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;