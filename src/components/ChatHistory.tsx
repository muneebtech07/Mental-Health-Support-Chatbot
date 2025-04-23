import React from 'react';
import { ChatSession } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, X, Trash2 } from 'lucide-react';

interface ChatHistoryProps {
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onClose: () => void;
  selectedSessionId?: string | null;
}

export function ChatHistory({ sessions, onSelectSession, onDeleteSession, onClose, selectedSessionId }: ChatHistoryProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Chat History</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No chat history yet. Start a new conversation!
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                selectedSessionId === session.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => {
                onSelectSession(session);
                onClose(); // Close the history panel after selection
              }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MessageCircle className="text-indigo-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{session.title}</h3>
                  <p className="text-sm text-gray-500">
                    {session.messages.length} messages · {
                      session.lastMessageAt && !isNaN(new Date(session.lastMessageAt).getTime())
                        ? formatDistanceToNow(new Date(session.lastMessageAt), { addSuffix: true })
                        : ''
                    }
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this chat?')) {
                      onDeleteSession(session.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete chat"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}