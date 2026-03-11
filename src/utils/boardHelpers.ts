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
 * Get the slice index for a given coordinate based on the active slice view.
 */
export function getSliceIndex(coord: BoardCoord, sliceView: SliceView): number {
  switch (sliceView) {
    case 'none':
      return 0; // all cells in one group
    case 'horizontal':
      return coord[0]; // layer
    case 'vertical-x':
      return coord[2]; // col
    case 'vertical-z':
      return coord[1]; // row
  }
}

/**
 * Compute the split offset for a slice. All 3 slices spread apart equally
 * when a split direction is active. Slice 0 goes negative, 1 stays center, 2 goes positive.
 */
export function getSliceSplitOffset(
  sliceIndex: number,
  sliceView: SliceView,
): [number, number, number] {
  if (sliceView === 'none') return [0, 0, 0];

  const SPLIT_DISTANCE = 1.8;
  // sliceIndex 0 → -1, sliceIndex 1 → 0, sliceIndex 2 → +1
  const direction = sliceIndex - 1;
  const offset = direction * SPLIT_DISTANCE;

  switch (sliceView) {
    case 'horizontal':
      return [0, -offset, 0]; // layers split on Y (inverted: layer 0 = top)
    case 'vertical-x':
      return [offset, 0, 0]; // cols split on X
    case 'vertical-z':
      return [0, 0, offset]; // rows split on Z
  }
}
