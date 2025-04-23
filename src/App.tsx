import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, SmilePlus } from 'lucide-react';
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
import { signOut } from './services/auth';
import { supabase } from './services/supabase';
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
    const session = supabase.auth.getSession();
    return session?.data?.session?.user || null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'chat';
  });

  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [exercises, setExercises] = useState(initialExercises);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecordType[]>([]);
  const [showThoughtRecord, setShowThoughtRecord] = useState(false);
  const [editingThoughtRecord, setEditingThoughtRecord] = useState<ThoughtRecordType | null>(null);
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([sampleMeditation]);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadChatSessions();
      loadThoughtRecords();
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'thoughts') {
      loadThoughtRecords();
    }
  }, [activeTab, user]);

  const loadThoughtRecords = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('thought_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setThoughtRecords(data.map(record => ({
          id: record.id,
          timestamp: new Date(record.created_at),
          situation: record.situation,
          automaticThoughts: record.automatic_thoughts,
          emotions: record.emotions,
          evidenceFor: record.evidence_for,
          evidenceAgainst: record.evidence_against,
          balancedThought: record.balanced_thought,
          newEmotions: []
        })));
      }
    } catch (error) {
      console.error('Error loading thought records:', error);
    }
  };

  const loadChatSessions = async () => {
    if (!user) return;
    try {
      const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select('*, chat_messages(*)')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      if (sessions) {
        setChatSessions(sessions.map(session => ({
          ...session,
          messages: session.chat_messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.role,
            timestamp: new Date(msg.created_at)
          }))
        })));
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const handleSelectSession = async (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowChatHistory(false);
  };

  const handleSendMessage = async (content: string, context: Message[]) => {
    if (!user) return;

    try {
      let sessionId = currentSessionId;
      
      if (!sessionId) {
        const { data: session, error: sessionError } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: content.slice(0, 50)
          })
          .select()
          .single();

        if (sessionError) throw sessionError;
        if (session) {
          sessionId = session.id;
          setCurrentSessionId(sessionId);
        }
      }

      if (!sessionId) throw new Error('Failed to create chat session');

      const { data: userMessage, error: userMessageError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          content,
          role: 'user'
        })
        .select()
        .single();

      if (userMessageError) throw userMessageError;

      if (userMessage) {
        const newUserMessage = {
          id: userMessage.id,
          content,
          sender: 'user' as const,
          timestamp: new Date(userMessage.created_at)
        };
        setMessages(prev => [...prev, newUserMessage]);
      }

      const response = await chatService.sendMessage(content, context);

      const { data: botMessage, error: botMessageError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          content: response.message,
          role: 'bot'
        })
        .select()
        .single();

      if (botMessageError) throw botMessageError;

      if (botMessage) {
        const newBotMessage = {
          id: botMessage.id,
          content: response.message,
          sender: 'bot' as const,
          timestamp: new Date(botMessage.created_at)
        };
        setMessages(prev => [...prev, newBotMessage]);
      }

      await supabase
        .from('chat_sessions')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', sessionId);

      await loadChatSessions();

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };

  const handleMoodSelect = async (mood: Mood) => {
    if (!user) return;

    try {
      const newEntry: MoodEntry = {
        id: crypto.randomUUID(),
        mood,
        timestamp: new Date(),
        userId: user.id
      };

      const { error } = await supabase
        .from('mood_entries')
        .insert({
          mood: mood.type,
          intensity: mood.intensity,
          notes: mood.notes,
          user_id: user.id
        });

      if (error) throw error;

      setMoodEntries(prev => [...prev, newEntry]);
      setShowMoodTracker(false);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
  };

  const handleSaveThoughtRecord = async (record: ThoughtRecordType) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('thought_records')
        .upsert({
          id: record.id || crypto.randomUUID(),
          user_id: user.id,
          situation: record.situation,
          automatic_thoughts: record.automaticThoughts,
          emotions: record.emotions,
          evidence_for: record.evidenceFor,
          evidence_against: record.evidenceAgainst,
          balanced_thought: record.balancedThought
        });

      if (error) throw error;

      setThoughtRecords(prevRecords => {
        const existingRecordIndex = prevRecords.findIndex(r => r.id === record.id);
        if (existingRecordIndex > -1) {
          const updatedRecords = [...prevRecords];
          updatedRecords[existingRecordIndex] = record;
          return updatedRecords;
        } else {
          return [...prevRecords, record];
        }
      });

      setShowThoughtRecord(false);
      setEditingThoughtRecord(null);
    } catch (error) {
      console.error('Error saving thought record:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setMessages([]);
      setChatSessions([]);
      setCurrentSessionId(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
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
              onClick={() => {
                setMessages([]);
                setCurrentSessionId(null);
              }}
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
              selectedSessionId={currentSessionId}
            />
          ) : activeTab === 'chat' ? (
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              selectedSessionId={currentSessionId}
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
              <div className="grid gap-4">
                {thoughtRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Situation</h3>
                      <p className="text-gray-600">{record.situation}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Thoughts</h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {record.automaticThoughts.map((thought, index) => (
                          <li key={index}>{thought}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Emotions</h3>
                      <div className="flex flex-wrap gap-2">
                        {record.emotions.map((emotion, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                          >
                            {emotion.name} ({emotion.intensity}%)
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
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