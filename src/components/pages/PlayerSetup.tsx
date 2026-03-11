import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { PLAYER_COLORS, PLAYER_SYMBOLS } from '../../utils/constants';
import type { PlayerID } from '../../types/game';

export function PlayerSetup() {
  const screen = useGameStore((s) => s.screen);
  const setupPlayers = useGameStore((s) => s.setupPlayers);
  const resetToHome = useGameStore((s) => s.resetToHome);

  const [names, setNames] = useState(['', '', '']);

  if (screen !== 'setup') return null;

  const handleNameChange = (index: number, value: string) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleStart = () => {
    const trimmed = names.map((n, i) => n.trim() || `Player ${i + 1}`);
    setupPlayers(trimmed as [string, string, string]);
  };

  const playerIds: PlayerID[] = ['P1', 'P2', 'P3'];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-void animate-fade-in">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        <h2 className="font-display text-xl font-bold tracking-wider text-center text-white/80 mb-8">
          Enter Player Names
        </h2>

        <div className="flex flex-col gap-4 mb-8">
          {playerIds.map((id, i) => (
            <div key={id} className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                style={{ color: PLAYER_COLORS[id] }}
              >
                {PLAYER_SYMBOLS[id]}
              </span>
              <input
                type="text"
                maxLength={15}
                placeholder={`Player ${i + 1}`}
                value={names[i]}
                onChange={(e) => handleNameChange(i, e.target.value)}
                className="w-full bg-white/5 border rounded-lg px-10 py-3 text-sm font-mono text-white placeholder-white/20 outline-none focus:bg-white/8 transition-colors"
                style={{ borderColor: `${PLAYER_COLORS[id]}33` }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = PLAYER_COLORS[id];
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = `${PLAYER_COLORS[id]}33`;
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleStart}
            className="btn-neon text-base py-4 w-full hover:scale-[1.02] transition-transform"
            style={{
              borderColor: 'rgba(61, 139, 255, 0.4)',
              boxShadow: '0 0 30px rgba(61, 139, 255, 0.15)',
            }}
          >
            Start Game
          </button>
          <button
            onClick={resetToHome}
            className="btn-neon text-xs py-2 w-full opacity-40 hover:opacity-80"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
