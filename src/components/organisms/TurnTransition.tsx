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
        className="glass-panel px-10 py-6 text-center cursor-pointer transition-all hover:scale-105 active:scale-95"
        style={{
          borderColor: color,
          borderWidth: 2,
          boxShadow: `0 0 40px ${color}33, 0 0 80px ${color}11`,
        }}
      >
        <p className="text-white/40 font-display text-xs tracking-[0.3em] uppercase mb-3">
          Pass to
        </p>
        <div className="text-4xl mb-2" style={{ color }}>
          {symbol}
        </div>
        <h2
          className="font-display text-xl font-bold tracking-wider mb-3"
          style={{ color }}
        >
          {playerName}
        </h2>
        <p
          className="font-display text-xs tracking-wider uppercase"
          style={{ color, opacity: 0.7 }}
        >
          Tap to Start
        </p>
      </button>
    </div>
  );
}
