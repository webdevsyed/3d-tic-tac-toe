export type PlayerID = 'P1' | 'P2' | 'P3';

export type CellValue = PlayerID | null;

export type BoardCoord = [number, number, number]; // [layer, row, col]

export type Board = CellValue[][][]; // 3×3×3

export type SliceView = 'horizontal' | 'vertical-x' | 'vertical-z';

export type GameScreen = 'home' | 'setup' | 'transitioning' | 'playing' | 'finished';

export interface PlayerInfo {
  name: string;
  id: PlayerID;
}

export interface MoveRecord {
  player: PlayerID;
  cell: BoardCoord;
}

export interface GameState {
  screen: GameScreen;
  board: Board;
  currentTurn: PlayerID;
  players: Record<PlayerID, PlayerInfo>;
  winner: PlayerID | 'draw' | null;
  winningLine: BoardCoord[] | null;
  moveHistory: MoveRecord[];
  sliceView: SliceView;
  focusedSlice: number | null; // 0, 1, or 2 — null = show all
  startingPlayer: PlayerID; // rotates each game
}
