import React from 'react';
import { History } from 'lucide-react';
import type { GameHistory } from '../types/game';

interface GameHistoryProps {
  history: GameHistory[];
}

export const GameHistoryComponent: React.FC<GameHistoryProps> = ({ history }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <History className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Game History</h2>
      </div>
      <div className="space-y-2">
        {history.map((entry) => (
          <div
            key={entry.period}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <span className="text-sm text-gray-600">Period {entry.period}</span>
            <div className="flex items-center space-x-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  entry.color === 'red' ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                {entry.result}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};