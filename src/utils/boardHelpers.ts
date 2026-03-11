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

/**
 * Get the slice index for a given coordinate based on the active slice view.
 */
export function getSliceIndex(coord: BoardCoord, sliceView: SliceView): number {
  switch (sliceView) {
    case 'horizontal':
      return coord[0]; // layer
    case 'vertical-x':
      return coord[2]; // col
    case 'vertical-z':
      return coord[1]; // row
  }
}

/**
 * Compute the target split offset for a slice when a specific slice is focused.
 * Unfocused slices move away; focused slice stays centered.
 */
export function getSliceSplitOffset(
  sliceIndex: number,
  sliceView: SliceView,
  focusedSlice: number | null
): [number, number, number] {
  if (focusedSlice === null) return [0, 0, 0];

  const SPLIT_DISTANCE = 1.5;
  const diff = sliceIndex - focusedSlice;
  if (diff === 0) return [0, 0, 0];

  const offset = diff > 0 ? SPLIT_DISTANCE : -SPLIT_DISTANCE;

  switch (sliceView) {
    case 'horizontal':
      return [0, -offset, 0]; // layers split on Y (inverted because layer 0 = top)
    case 'vertical-x':
      return [offset, 0, 0]; // cols split on X
    case 'vertical-z':
      return [0, 0, offset]; // rows split on Z
  }
}
