import { useGameStore } from '../../stores/gameStore';
import { PLAYER_COLORS, PLAYER_SYMBOLS } from '../../utils/constants';

export function TurnTransition() {
  const screen = useGameStore((s) => s.screen);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const players = useGameStore((s) => s.players);
  const startTurn = useGameStore((s) => s.startTurn);

  if (screen !== 'transitioning') return null;

  const color = PLAYER_COLORS[currentTurn];
  const symbol = PLAYER_SYMBOLS[currentTurn];
  const playerName = players[currentTurn].name;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-void/60 animate-fade-in">
      <button
        onClick={startTurn}
        className="glass-panel px-8 py-5 text-center cursor-pointer transition-all hover:scale-105 active:scale-95 max-w-[260px] w-full mx-6"
        style={{
          borderColor: color,
          borderWidth: 2,
          boxShadow: `0 0 40px ${color}33, 0 0 80px ${color}11`,
        }}
      >
        <p className="text-white/40 font-display text-[10px] tracking-[0.3em] uppercase mb-2">
          Pass to
        </p>
        <div className="text-3xl mb-1" style={{ color }}>
          {symbol}
        </div>
        <h2
          className="font-display text-lg font-bold tracking-wider mb-2"
          style={{ color }}
        >
          {playerName}
        </h2>
        <p
          className="font-display text-[10px] tracking-wider uppercase"
          style={{ color, opacity: 0.7 }}
        >
          Tap to Start
        </p>
      </button>
    </div>
  );
}
