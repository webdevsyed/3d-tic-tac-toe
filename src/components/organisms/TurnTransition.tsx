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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-void/95 animate-fade-in">
      <div className="text-center">
        <p className="text-white/40 font-display text-sm tracking-[0.3em] uppercase mb-6">
          Pass to
        </p>

        <div
          className="glass-panel px-12 py-8 mb-8"
          style={{
            borderColor: color,
            borderWidth: 2,
            boxShadow: `0 0 40px ${color}33, 0 0 80px ${color}11`,
          }}
        >
          <div className="text-5xl mb-3" style={{ color }}>
            {symbol}
          </div>
          <h2
            className="font-display text-2xl font-bold tracking-wider"
            style={{ color }}
          >
            {playerName}
          </h2>
        </div>

        <button
          onClick={startTurn}
          className="btn-neon text-lg px-10 py-4 transition-all hover:scale-105"
          style={{
            borderColor: color,
            color,
            boxShadow: `0 0 20px ${color}22`,
          }}
        >
          Tap to Start Turn
        </button>

        <p className="text-white/20 text-[10px] mt-6 max-w-[250px] mx-auto">
          Camera resets each turn so no one can see the previous player's viewing angle
        </p>
      </div>
    </div>
  );
}
