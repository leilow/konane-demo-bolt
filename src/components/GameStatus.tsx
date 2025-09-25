import React from 'react';
import { GameState } from '../types/game';
import { RotateCcw, Crown, Play } from 'lucide-react';

interface GameStatusProps {
  gameState: GameState;
  onResetGame: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({ gameState, onResetGame }) => {
  const { currentPlayer, gamePhase, winner, removedPieces } = gameState;

  const getStatusMessage = (): string => {
    switch (gamePhase) {
      case 'setup':
        return `Setup Phase: Remove ${2 - removedPieces} more piece${2 - removedPieces !== 1 ? 's' : ''} from center or corners`;
      case 'playing':
        return `${currentPlayer === 'black' ? 'Black' : 'White'}'s Turn`;
      case 'finished':
        return `Game Over - ${winner === 'black' ? 'Black' : 'White'} Wins!`;
      default:
        return '';
    }
  };

  const getCurrentPlayerColor = (): string => {
    if (gamePhase === 'finished') {
      return winner === 'black' ? 'text-slate-800' : 'text-gray-600';
    }
    return currentPlayer === 'black' ? 'text-slate-800' : 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {gamePhase === 'finished' ? (
            <Crown className="w-6 h-6 text-yellow-500" />
          ) : gamePhase === 'playing' ? (
            <Play className="w-6 h-6 text-blue-500" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-orange-500 animate-pulse" />
          )}
          <div>
            <h2 className={`text-xl font-bold ${getCurrentPlayerColor()}`}>
              {getStatusMessage()}
            </h2>
            {gamePhase === 'setup' && (
              <p className="text-sm text-gray-500 mt-1">
                Click on center pieces or corner pieces to remove them
              </p>
            )}
            {gamePhase === 'playing' && (
              <p className="text-sm text-gray-500 mt-1">
                Select a piece, then click on a valid move to jump and capture
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={onResetGame}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Game</span>
        </button>
      </div>
      
      {gamePhase === 'finished' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            🎉 Congratulations! The game has ended because the losing player has no valid moves remaining.
          </p>
        </div>
      )}
    </div>
  );
};