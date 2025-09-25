import React from 'react';
import { useKonaneGame } from './hooks/useKonaneGame';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { GameRules } from './components/GameRules';
import { Waves } from 'lucide-react';

function App() {
  const { gameState, handleCellClick, resetGame, BOARD_SIZE } = useKonaneGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-orange-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Waves className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Konane
            </h1>
            <Waves className="w-8 h-8 text-teal-600" />
          </div>
          <p className="text-gray-600 text-lg">The Traditional Hawaiian Strategy Game</p>
        </div>

        {/* Game Rules */}
        <GameRules />
        
        {/* Game Status */}
        <GameStatus gameState={gameState} onResetGame={resetGame} />
        
        {/* Game Board */}
        <div className="flex justify-center">
          <GameBoard
            gameState={gameState}
            onCellClick={handleCellClick}
            boardSize={BOARD_SIZE}
          />
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Konane - A traditional Hawaiian board game of strategy and skill</p>
          <p className="mt-1">Click pieces to select them, then click valid moves to jump and capture</p>
        </div>
      </div>
    </div>
  );
}

export default App;