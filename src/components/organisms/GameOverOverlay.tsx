import { useGameStore } from '../../stores/gameStore';
import { PLAYER_COLORS, PLAYER_SYMBOLS } from '../../utils/constants';

export function GameOverOverlay() {
  const screen = useGameStore((s) => s.screen);
  const winner = useGameStore((s) => s.winner);
  const players = useGameStore((s) => s.players);
  const playAgain = useGameStore((s) => s.playAgain);
  const resetToHome = useGameStore((s) => s.resetToHome);
  const setScreen = useGameStore((s) => s.setScreen);

  if (screen !== 'finished' || winner === null) return null;

  const isDraw = winner === 'draw';
  const winnerColor = isDraw ? '#ffffff' : PLAYER_COLORS[winner];
  const winnerName = isDraw ? '' : players[winner].name;
  const winnerSymbol = isDraw ? '' : PLAYER_SYMBOLS[winner];

  const handleNewPlayers = () => {
    setScreen('setup');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-void/80 animate-fade-in">
      <div className="text-center px-8 w-full max-w-xs sm:max-w-sm mx-auto">
        {isDraw ? (
          <h2 className="font-display text-3xl font-bold tracking-wider text-white/60 mb-10">
            It's a Draw!
          </h2>
        ) : (
          <>
            <div className="text-6xl mb-5" style={{ color: winnerColor }}>
              {winnerSymbol}
            </div>
            <h2
              className="font-display text-3xl font-bold tracking-wider mb-3"
              style={{
                color: winnerColor,
                textShadow: `0 0 30px ${winnerColor}66`,
              }}
            >
              {winnerName} Wins!
            </h2>
            <p className="text-white/50 text-sm mb-10">
              Congratulations!
            </p>
          </>
        )}

        <div className="flex flex-col gap-3 sm:gap-4">
          <button
            onClick={playAgain}
            className="btn-neon text-base w-full py-3"
            style={{
              borderColor: winnerColor,
              color: winnerColor,
            }}
          >
            Play Again
          </button>
          <button
            onClick={handleNewPlayers}
            className="btn-neon text-sm w-full py-2"
          >
            New Players
          </button>
          <button
            onClick={resetToHome}
            className="btn-neon text-sm w-full py-2 opacity-60 hover:opacity-100"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
