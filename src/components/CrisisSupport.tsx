import React from 'react';
import { Phone, MessageCircle, AlertTriangle } from 'lucide-react';
import type { CrisisResource } from '../types';

const crisisResources: CrisisResource[] = [
  {
    name: 'National Suicide Prevention Lifeline',
    type: 'hotline',
    contact: '1-800-273-8255',
    availableHours: '24/7',
    description: 'Free and confidential support for people in distress',
  },
  {
    name: 'Crisis Text Line',
    type: 'text',
    contact: 'Text HOME to 741741',
    availableHours: '24/7',
    description: 'Free crisis counseling via text message',
  },
  {
    name: 'Emergency Services',
    type: 'emergency',
    contact: '911',
    availableHours: '24/7',
    description: 'For immediate emergency assistance',
  },
];

interface CrisisSupportProps {
  onClose: () => void;
}

export function CrisisSupport({ onClose }: CrisisSupportProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-semibold">Crisis Support</h2>
        </div>

        <p className="text-gray-600 mb-6">
          If you're experiencing a crisis or having thoughts of self-harm, please reach out for help immediately. You're not alone.
        </p>

        <div className="space-y-4">
          {crisisResources.map((resource) => (
            <div
              key={resource.name}
              className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                {resource.type === 'hotline' && <Phone size={20} />}
                {resource.type === 'text' && <MessageCircle size={20} />}
                {resource.type === 'emergency' && <AlertTriangle size={20} />}
                <h3 className="font-semibold">{resource.name}</h3>
              </div>
              <p className="text-lg font-medium text-indigo-600 mb-1">
                {resource.contact}
              </p>
              <p className="text-sm text-gray-600">{resource.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Available: {resource.availableHours}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}