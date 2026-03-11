import { useGameStore } from '../../stores/gameStore';
import { SliceControls } from '../molecules/SliceControls';
import { PLAYER_COLORS, PLAYER_SYMBOLS } from '../../utils/constants';
import type { PlayerID } from '../../types/game';

function PlayerBadge({ playerId, isActive }: { playerId: PlayerID; isActive: boolean }) {
  const player = useGameStore((s) => s.players[playerId]);
  const color = PLAYER_COLORS[playerId];
  const symbol = PLAYER_SYMBOLS[playerId];

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
        isActive ? 'bg-white/10 scale-105' : 'opacity-50'
      }`}
      style={isActive ? { borderColor: color, borderWidth: 1 } : undefined}
    >
      <span style={{ color }} className="text-lg font-bold">
        {symbol}
      </span>
      <span className="text-xs font-mono truncate max-w-[80px]">{player.name}</span>
    </div>
  );
}

export function GameHUD() {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const players = useGameStore((s) => s.players);
  const moveHistory = useGameStore((s) => s.moveHistory);
  const screen = useGameStore((s) => s.screen);

  if (screen !== 'playing' && screen !== 'finished') return null;

  const currentColor = PLAYER_COLORS[currentTurn];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar - players + turn indicator */}
      <div className="flex items-center justify-between p-3 pointer-events-auto">
        <div className="glass-panel flex items-center gap-1 p-1.5">
          {(['P1', 'P2', 'P3'] as PlayerID[]).map((id) => (
            <PlayerBadge key={id} playerId={id} isActive={currentTurn === id} />
          ))}
        </div>

        {screen === 'playing' && (
          <div
            className="glass-panel px-4 py-2 font-display text-sm tracking-wider"
            style={{ color: currentColor }}
          >
            {players[currentTurn].name}'s Turn
          </div>
        )}
      </div>

      {/* Right side - slice controls */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="glass-panel p-2">
          <SliceControls />
        </div>
      </div>

      {/* Bottom - move log */}
      {moveHistory.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 pointer-events-auto">
          <div className="glass-panel px-3 py-2 flex gap-3 overflow-x-auto text-[10px] font-mono">
            {moveHistory.slice(-8).map((move, i) => (
              <span key={i} style={{ color: PLAYER_COLORS[move.player] }}>
                {PLAYER_SYMBOLS[move.player]}({move.cell.join(',')})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
