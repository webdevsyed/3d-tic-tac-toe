import type { PlayerID } from '../types/game';

export const PLAYER_COLORS: Record<PlayerID, string> = {
  P1: '#FF3D3D',
  P2: '#3D8BFF',
  P3: '#2DD881',
};

export const PLAYER_SYMBOLS: Record<PlayerID, string> = {
  P1: '✕',
  P2: '●',
  P3: '▲',
};

export const PLAYER_LABELS: Record<PlayerID, string> = {
  P1: 'X',
  P2: 'Sphere',
  P3: 'Pyramid',
};

export const CELL_SIZE = 1;
export const CELL_GAP = 0.15;

// Total spacing between cell centers (same in all 3 axes for cubic cells)
export const CELL_SPACING = CELL_SIZE + CELL_GAP;
export const LAYER_GAP = CELL_SPACING;

// Point light config for placed symbols
export const SYMBOL_LIGHT_INTENSITY = 0.6;
export const SYMBOL_LIGHT_DISTANCE = 3;

// Camera defaults
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [6, 5, 6];
export const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0, 0];

// Grid dimensions
export const GRID_SIZE = 3;

// Next player rotation
export const NEXT_PLAYER: Record<PlayerID, PlayerID> = {
  P1: 'P2',
  P2: 'P3',
  P3: 'P1',
};
