import type { BoardCoord, SliceView } from '../types/game';
import { CELL_SPACING, LAYER_GAP } from './constants';

/**
 * Convert board coordinates [layer, row, col] to 3D world position.
 */
export function coordToPosition(coord: BoardCoord): [number, number, number] {
  const [layer, row, col] = coord;
  return [
    (col - 1) * CELL_SPACING,
    (1 - layer) * LAYER_GAP,
    (row - 1) * CELL_SPACING,
  ];
}

/**
 * Determine the opacity for a cell based on the current slice view and focus.
 * Returns 1 for visible cells, ~0.1 for faded cells.
 */
export function getCellOpacity(
  coord: BoardCoord,
  sliceView: SliceView,
  focusedSlice: number | null
): number {
  if (focusedSlice === null) return 1;

  const [layer, row, col] = coord;

  let sliceIndex: number;
  switch (sliceView) {
    case 'horizontal':
      sliceIndex = layer;
      break;
    case 'vertical-x':
      sliceIndex = col;
      break;
    case 'vertical-z':
      sliceIndex = row;
      break;
  }

  return sliceIndex === focusedSlice ? 1 : 0.1;
}
