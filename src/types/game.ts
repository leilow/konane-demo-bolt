export interface Position {
  row: number;
  col: number;
}

export interface GamePiece {
  id: string;
  player: 'black' | 'white';
  position: Position;
}

export interface GameState {
  board: (GamePiece | null)[][];
  currentPlayer: 'black' | 'white';
  gamePhase: 'setup' | 'playing' | 'finished';
  selectedPiece: Position | null;
  validMoves: Position[];
  removedPieces: number;
  winner: 'black' | 'white' | null;
  moveHistory: Position[][];
}

export interface Move {
  from: Position;
  to: Position;
  capturedPieces: Position[];
}