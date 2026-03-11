import { useGameStore } from '../../stores/gameStore';
import type { SliceView } from '../../types/game';

const SLICE_LABELS: Record<SliceView, string> = {
  'none': 'Split View',
  'horizontal': 'Horizontal ↻',
  'vertical-x': 'Vertical X ↻',
  'vertical-z': 'Vertical Z ↻',
};

export function SliceControls() {
  const sliceView = useGameStore((s) => s.sliceView);
  const cycleSliceView = useGameStore((s) => s.cycleSliceView);

  return (
    <button
      onClick={cycleSliceView}
      className={`btn-neon text-xs px-4 py-2 ${sliceView !== 'none' ? 'border-white/40 bg-white/10' : ''}`}
      aria-label={`Current view: ${SLICE_LABELS[sliceView]}. Click to cycle.`}
    >
      {SLICE_LABELS[sliceView]}
    </button>
  );
}
