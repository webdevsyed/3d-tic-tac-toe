import { useGameStore } from '../../stores/gameStore';
import type { SliceView } from '../../types/game';

const SLICE_LABELS: Record<SliceView, string> = {
  'horizontal': 'Horizontal',
  'vertical-x': 'Vertical X',
  'vertical-z': 'Vertical Z',
};

const SLICE_NAMES: Record<SliceView, [string, string, string]> = {
  'horizontal': ['Top', 'Mid', 'Bot'],
  'vertical-x': ['Left', 'Mid', 'Right'],
  'vertical-z': ['Front', 'Mid', 'Back'],
};

export function SliceControls() {
  const sliceView = useGameStore((s) => s.sliceView);
  const focusedSlice = useGameStore((s) => s.focusedSlice);
  const cycleSliceView = useGameStore((s) => s.cycleSliceView);
  const setFocusedSlice = useGameStore((s) => s.setFocusedSlice);

  const sliceNames = SLICE_NAMES[sliceView];

  return (
    <div className="flex flex-col gap-2">
      {/* Cycle view button */}
      <button
        onClick={cycleSliceView}
        className="btn-neon text-xs px-3 py-2"
        aria-label={`Current view: ${SLICE_LABELS[sliceView]}. Click to cycle.`}
      >
        {SLICE_LABELS[sliceView]} ↻
      </button>

      {/* Slice focus buttons */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setFocusedSlice(focusedSlice === i ? null : i)}
            className={`btn-neon text-[10px] px-2 py-1 flex-1 ${
              focusedSlice === i ? 'border-white/40 bg-white/10' : ''
            }`}
            aria-label={`Focus ${sliceNames[i]} slice`}
          >
            {sliceNames[i]}
          </button>
        ))}
      </div>

      {/* Show All */}
      {focusedSlice !== null && (
        <button
          onClick={() => setFocusedSlice(null)}
          className="btn-neon text-[10px] px-2 py-1"
        >
          Show All
        </button>
      )}
    </div>
  );
}
