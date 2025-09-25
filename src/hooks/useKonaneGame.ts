import { useState, useCallback } from 'react';
import { GameState, Position, GamePiece, Move } from '../types/game';

const BOARD_SIZE = 8;

export const useKonaneGame = () => {
  const createInitialBoard = (): (GamePiece | null)[][] => {
    const board: (GamePiece | null)[][] = [];
    let id = 0;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      board[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        // Alternating pattern: black on even sum positions, white on odd sum positions
        const isBlack = (row + col) % 2 === 0;
        board[row][col] = {
          id: `piece-${id++}`,
          player: isBlack ? 'black' : 'white',
          position: { row, col }
        };
      }
    }
    
    return board;
  };

  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'black',
    gamePhase: 'setup',
    selectedPiece: null,
    validMoves: [],
    removedPieces: 0,
    winner: null,
    moveHistory: []
  });

  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

  const findValidJumps = (from: Position, board: (GamePiece | null)[][], visited: Set<string> = new Set()): Position[] => {
    const moves: Position[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right
    
    for (const [dRow, dCol] of directions) {
      const jumpOverRow = from.row + dRow;
      const jumpOverCol = from.col + dCol;
      const landRow = from.row + (dRow * 2);
      const landCol = from.col + (dCol * 2);
      
      if (isValidPosition(landRow, landCol)) {
        const jumpOverPiece = board[jumpOverRow]?.[jumpOverCol];
        const landingSpot = board[landRow]?.[landCol];
        const currentPiece = board[from.row][from.col];
        
        // Can jump if there's an opponent piece to jump over and empty spot to land
        if (jumpOverPiece && 
            landingSpot === null && 
            currentPiece &&
            jumpOverPiece.player !== currentPiece.player) {
          const moveKey = `${landRow}-${landCol}`;
          if (!visited.has(moveKey)) {
            moves.push({ row: landRow, col: landCol });
          }
        }
      }
    }
    
    return moves;
  };

  const executeMove = (from: Position, to: Position): Move => {
    const capturedPieces: Position[] = [];
    const dRow = to.row > from.row ? 1 : to.row < from.row ? -1 : 0;
    const dCol = to.col > from.col ? 1 : to.col < from.col ? -1 : 0;
    
    // Find all pieces between from and to positions
    let currentRow = from.row + dRow;
    let currentCol = from.col + dCol;
    
    while (currentRow !== to.row || currentCol !== to.col) {
      capturedPieces.push({ row: currentRow, col: currentCol });
      currentRow += dRow;
      currentCol += dCol;
    }
    
    return { from, to, capturedPieces };
  };

  const canPlayerMove = (player: 'black' | 'white', board: (GamePiece | null)[][]): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.player === player) {
          const validMoves = findValidJumps({ row, col }, board);
          if (validMoves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleCellClick = useCallback((row: number, col: number) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      
      if (newState.gamePhase === 'setup') {
        // Remove pieces during setup phase
        if (newState.board[row][col] && newState.removedPieces < 2) {
          // Can only remove center pieces or corner pieces on first two moves
          const isCenter = Math.abs(row - 3.5) <= 0.5 && Math.abs(col - 3.5) <= 0.5;
          const isCorner = (row === 0 || row === BOARD_SIZE - 1) && (col === 0 || col === BOARD_SIZE - 1);
          
          if (isCenter || isCorner) {
            const newBoard = newState.board.map(r => [...r]);
            newBoard[row][col] = null;
            newState.board = newBoard;
            newState.removedPieces += 1;
            
            if (newState.removedPieces === 2) {
              newState.gamePhase = 'playing';
            }
          }
        }
        return newState;
      }
      
      if (newState.gamePhase !== 'playing') return prevState;
      
      const clickedPiece = newState.board[row][col];
      
      // If clicking on own piece, select it
      if (clickedPiece && clickedPiece.player === newState.currentPlayer) {
        newState.selectedPiece = { row, col };
        newState.validMoves = findValidJumps({ row, col }, newState.board);
        return newState;
      }
      
      // If clicking on valid move destination
      if (newState.selectedPiece && 
          newState.validMoves.some(move => move.row === row && move.col === col)) {
        
        const move = executeMove(newState.selectedPiece, { row, col });
        const newBoard = newState.board.map(r => [...r]);
        
        // Move the piece
        const piece = newBoard[newState.selectedPiece.row][newState.selectedPiece.col];
        if (piece) {
          piece.position = { row, col };
          newBoard[row][col] = piece;
          newBoard[newState.selectedPiece.row][newState.selectedPiece.col] = null;
          
          // Remove captured pieces
          move.capturedPieces.forEach(pos => {
            newBoard[pos.row][pos.col] = null;
          });
        }
        
        newState.board = newBoard;
        newState.selectedPiece = null;
        newState.validMoves = [];
        newState.moveHistory.push([move.from, move.to]);
        
        // Check for additional jumps from new position
        const additionalJumps = findValidJumps({ row, col }, newBoard);
        if (additionalJumps.length > 0) {
          // Player must continue jumping
          newState.selectedPiece = { row, col };
          newState.validMoves = additionalJumps;
        } else {
          // Switch turns
          const nextPlayer = newState.currentPlayer === 'black' ? 'white' : 'black';
          
          // Check if next player can move
          if (!canPlayerMove(nextPlayer, newBoard)) {
            newState.gamePhase = 'finished';
            newState.winner = newState.currentPlayer;
          } else {
            newState.currentPlayer = nextPlayer;
          }
        }
      } else {
        // Deselect if clicking elsewhere
        newState.selectedPiece = null;
        newState.validMoves = [];
      }
      
      return newState;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'black',
      gamePhase: 'setup',
      selectedPiece: null,
      validMoves: [],
      removedPieces: 0,
      winner: null,
      moveHistory: []
    });
  }, []);

  return {
    gameState,
    handleCellClick,
    resetGame,
    BOARD_SIZE
  };
};