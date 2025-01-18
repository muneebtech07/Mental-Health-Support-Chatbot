/**
 * Chat component for handling conversations
 * @author MuNeeB Tech
 */


import React, { useState, useEffect, useRef } from 'react';
import { Send, User2, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import type { Message } from '../types';
import { CRISIS_KEYWORDS } from '../types';
import { CrisisSupport } from './CrisisSupport';

interface ChatProps {
  messages: Message[];
  onSendMessage: (content: string, context: Message[]) => void;
}

interface TruncatedMessageProps {
  content: string;
  maxLength?: number;
}

const TruncatedMessage: React.FC<TruncatedMessageProps> = ({ content, maxLength = 300 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = content.length > maxLength;
  const displayText = shouldTruncate && !isExpanded ? `${content.slice(0, maxLength)}...` : content;

  return (
    <div className="relative">
      <div className="whitespace-pre-wrap break-words">{displayText}</div>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm mt-1 text-indigo-500 hover:text-indigo-600 flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Show More <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export function Chat({ messages, onSendMessage }: ChatProps) {
  const [input, setInput] = useState('');
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(null);
    setIsLoading(true);
    
    const hasCrisisKeywords = CRISIS_KEYWORDS.some(keyword =>
      input.toLowerCase().includes(keyword)
    );

    if (hasCrisisKeywords) {
      setShowCrisisSupport(true);
    }

    try {
      const userInput = input;
      setInput(''); // Clear input immediately after submission
      await onSendMessage(userInput, messages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Chat error:', errorMessage);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-indigo-50 to-purple-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {message.sender === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Bot size={20} className="text-indigo-600" />
                </div>
              )}
              <div
                className={`p-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-2xl rounded-tl-none'
                }`}
              >
                <TruncatedMessage content={message.content} />
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <User2 size={20} className="text-indigo-600" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Bot size={20} className="text-indigo-600" />
              </div>
              <div className="p-3 bg-white rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center p-2 text-red-600 bg-red-50 rounded-lg shadow-sm">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex-shrink-0 border-t bg-white shadow-lg p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-indigo-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-sm ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>

      {showCrisisSupport && (
        <CrisisSupport onClose={() => setShowCrisisSupport(false)} />
      )}
    </div>
  );
}