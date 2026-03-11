import { create } from 'zustand';
import type { Board, BoardCoord, GameScreen, GameState, SliceView } from '../types/game';
import { NEXT_PLAYER } from '../utils/constants';
import { checkDraw, checkWin } from '../utils/winConditions';

function createEmptyBoard(): Board {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => null)
    )
  );
}

interface GameActions {
  setScreen: (screen: GameScreen) => void;
  setupPlayers: (names: [string, string, string]) => void;
  startTurn: () => void;
  placeMove: (coord: BoardCoord) => void;
  setSliceView: (view: SliceView) => void;
  setFocusedSlice: (slice: number | null) => void;
  cycleSliceView: () => void;
  playAgain: () => void;
  resetToHome: () => void;
}

const SLICE_VIEW_ORDER: SliceView[] = ['horizontal', 'vertical-x', 'vertical-z'];

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // Initial state
  screen: 'home',
  board: createEmptyBoard(),
  currentTurn: 'P1',
  players: {
    P1: { name: 'Player 1', id: 'P1' },
    P2: { name: 'Player 2', id: 'P2' },
    P3: { name: 'Player 3', id: 'P3' },
  },
  winner: null,
  winningLine: null,
  moveHistory: [],
  sliceView: 'horizontal',
  focusedSlice: null,
  startingPlayer: 'P1',

  setScreen: (screen) => set({ screen }),

  setupPlayers: (names) => {
    const state = get();
    set({
      players: {
        P1: { name: names[0] || 'Player 1', id: 'P1' },
        P2: { name: names[1] || 'Player 2', id: 'P2' },
        P3: { name: names[2] || 'Player 3', id: 'P3' },
      },
      board: createEmptyBoard(),
      currentTurn: state.startingPlayer,
      winner: null,
      winningLine: null,
      moveHistory: [],
      screen: 'transitioning',
    });
  },

  startTurn: () => set({ screen: 'playing' }),

  placeMove: ([layer, row, col]) => {
    const state = get();
    if (state.screen !== 'playing') return;
    if (state.board[layer][row][col] !== null) return;

    const newBoard = state.board.map((l) => l.map((r) => [...r]));
    newBoard[layer][row][col] = state.currentTurn;

    const newHistory = [...state.moveHistory, { player: state.currentTurn, cell: [layer, row, col] as BoardCoord }];

    // Check win first (takes priority over draw)
    const winResult = checkWin(newBoard);
    if (winResult) {
      set({
        board: newBoard,
        moveHistory: newHistory,
        winner: winResult.winner,
        winningLine: winResult.line,
        screen: 'finished',
      });
      return;
    }

    // Check draw
    if (checkDraw(newBoard)) {
      set({
        board: newBoard,
        moveHistory: newHistory,
        winner: 'draw',
        screen: 'finished',
      });
      return;
    }

    // Next turn
    const nextPlayer = NEXT_PLAYER[state.currentTurn];
    set({
      board: newBoard,
      moveHistory: newHistory,
      currentTurn: nextPlayer,
      screen: 'transitioning',
    });
  },

  setSliceView: (sliceView) => set({ sliceView, focusedSlice: null }),

  setFocusedSlice: (focusedSlice) => set({ focusedSlice }),

  cycleSliceView: () => {
    const state = get();
    const currentIndex = SLICE_VIEW_ORDER.indexOf(state.sliceView);
    const nextIndex = (currentIndex + 1) % SLICE_VIEW_ORDER.length;
    set({ sliceView: SLICE_VIEW_ORDER[nextIndex], focusedSlice: null });
  },

  playAgain: () => {
    const state = get();
    const nextStarter = NEXT_PLAYER[state.startingPlayer];
    set({
      board: createEmptyBoard(),
      currentTurn: nextStarter,
      startingPlayer: nextStarter,
      winner: null,
      winningLine: null,
      moveHistory: [],
      sliceView: 'horizontal',
      focusedSlice: null,
      screen: 'transitioning',
    });
  },

  resetToHome: () =>
    set({
      screen: 'home',
      board: createEmptyBoard(),
      currentTurn: 'P1',
      winner: null,
      winningLine: null,
      moveHistory: [],
      sliceView: 'horizontal',
      focusedSlice: null,
      startingPlayer: 'P1',
    }),
}));
