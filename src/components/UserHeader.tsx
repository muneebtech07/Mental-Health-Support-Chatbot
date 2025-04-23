import React from 'react';
import { User } from '../types';
import { LogOut } from 'lucide-react';

interface UserHeaderProps {
  user: User;
  onLogout: () => void;
}

export function UserHeader({ user, onLogout }: UserHeaderProps) {
  return (
    <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{user.avatar}</span>
        <span className="font-medium">{user.username}</span>
      </div>
      <button
        onClick={onLogout}
        className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}