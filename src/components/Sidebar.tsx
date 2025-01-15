import React, { useState } from 'react';
import { MessageCircle, Activity, BarChart3, Brain, Target, Sparkles, Menu, X, History } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowHistory: () => void;
  showChatHistory: boolean;
  onCloseChatHistory: () => void;
}

export function Sidebar({ activeTab, onTabChange, onShowHistory, showChatHistory, onCloseChatHistory }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'history', icon: History, label: 'Chat History', onClick: onShowHistory },
    { id: 'exercises', icon: Activity, label: 'Exercises' },
    { id: 'thoughts', icon: Brain, label: 'Thoughts' },
    { id: 'meditation', icon: Sparkles, label: 'Meditation' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
  ];

  const handleTabClick = (tab: { id: string, onClick?: () => void }) => {
    if (tab.onClick) {
      tab.onClick();
    } else {
      if (showChatHistory) {
        onCloseChatHistory();
      }
      onTabChange(tab.id);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 lg:w-20 bg-indigo-900 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex flex-col items-center py-8 h-full overflow-y-auto">
          {tabs.map(({ id, icon: Icon, label, onClick }) => (
            <button
              key={id}
              onClick={() => handleTabClick({ id, onClick })}
              className={`w-full flex items-center gap-3 p-3 lg:justify-center transition-colors ${
                activeTab === id && !onClick
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-300 hover:bg-indigo-800'
              }`}
              title={label}
              aria-label={label}
            >
              <Icon size={24} aria-hidden="true" />
              <span className="lg:hidden">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}