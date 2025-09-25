import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const GameRules: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 rounded-xl shadow-md border border-blue-200 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100 transition-colors duration-200 rounded-xl"
      >
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">How to Play Konane</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 text-blue-800">
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <h4 className="font-semibold mb-2">🎯 Objective</h4>
            <p className="text-sm">Be the last player able to make a move. Your opponent loses when they cannot jump any of their pieces.</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <h4 className="font-semibold mb-2">🚀 Setup</h4>
            <p className="text-sm">Remove two pieces from the board - one from the center area and one from a corner, or both from the center.</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <h4 className="font-semibold mb-2">🎮 Gameplay</h4>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Jump orthogonally (up, down, left, right) over opponent pieces</li>
              <li>• Captured pieces are removed from the board</li>
              <li>• If you can make another jump after landing, you must continue jumping</li>
              <li>• No diagonal moves allowed</li>
            </ul>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <h4 className="font-semibold mb-2">🏆 Winning</h4>
            <p className="text-sm">The game ends when a player cannot make any legal moves. That player loses!</p>
          </div>
        </div>
      )}
    </div>
  );
};