import React from 'react';
import { GameState, Position } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (row: number, col: number) => void;
  boardSize: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCellClick, boardSize }) => {
  const { board, selectedPiece, validMoves, gamePhase } = gameState;

  const isSelected = (row: number, col: number): boolean => {
    return selectedPiece?.row === row && selectedPiece?.col === col;
  };

  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const getCellClasses = (row: number, col: number): string => {
    let classes = "aspect-square border border-amber-300 flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-lg";
    
    // Alternating board pattern
    if ((row + col) % 2 === 0) {
      classes += " bg-amber-100";
    } else {
      classes += " bg-amber-50";
    }
    
    // Selected piece highlighting
    if (isSelected(row, col)) {
      classes += " ring-4 ring-blue-400 ring-opacity-75 shadow-lg";
    }
    
    // Valid move highlighting
    if (isValidMove(row, col)) {
      classes += " bg-green-200 hover:bg-green-300 ring-2 ring-green-400 ring-opacity-50";
    } else if (!board[row][col]) {
      classes += " hover:bg-amber-200";
    }
    
    return classes;
  };

  const getPieceClasses = (player: 'black' | 'white', row: number, col: number): string => {
    let classes = "w-8 h-8 rounded-full border-2 shadow-md transition-all duration-200 hover:scale-110";
    
    if (player === 'black') {
      classes += " bg-slate-800 border-slate-600";
    } else {
      classes += " bg-white border-gray-300";
    }
    
    if (isSelected(row, col)) {
      classes += " scale-110 shadow-xl";
    }
    
    return classes;
  };

  return (
    <div className="inline-block p-4 bg-amber-200 rounded-xl shadow-2xl border-4 border-amber-600">
      <div className="grid grid-cols-8 gap-0 bg-amber-800 p-2 rounded-lg">
        {Array.from({ length: boardSize }, (_, row) =>
          Array.from({ length: boardSize }, (_, col) => {
            const piece = board[row][col];
            
            return (
              <div
                key={`${row}-${col}`}
                className={getCellClasses(row, col)}
                onClick={() => onCellClick(row, col)}
              >
                {piece && (
                  <div className={getPieceClasses(piece.player, row, col)} />
                )}
                {isValidMove(row, col) && !piece && (
                  <div className="w-6 h-6 rounded-full bg-green-400 opacity-60 animate-pulse" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};