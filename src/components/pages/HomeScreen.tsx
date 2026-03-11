import { useGameStore } from '../../stores/gameStore';

interface HomeScreenProps {
  onShowHelp: () => void;
}

export function HomeScreen({ onShowHelp }: HomeScreenProps) {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-void">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, #1a0a2e 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, #0a1a2e 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 text-center animate-fade-in px-6 pb-16 w-full max-w-md">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black tracking-wider text-white mb-2">
            3D TIC-TAC-TOE
          </h1>
          <p className="font-display text-xs sm:text-sm tracking-[0.4em] text-white/30 uppercase">
            3 Players
          </p>
        </div>

        {/* Menu */}
        <div className="flex flex-col items-center gap-4 w-full max-w-64 mx-auto">
          <button
            onClick={() => setScreen('setup')}
            className="btn-neon text-base py-4 hover:scale-105 transition-transform"
            style={{
              borderColor: 'rgba(61, 139, 255, 0.3)',
              boxShadow: '0 0 30px rgba(61, 139, 255, 0.1)',
            }}
          >
            New Game
          </button>
          <button
            onClick={onShowHelp}
            className="btn-neon text-sm py-3 opacity-60 hover:opacity-100"
          >
            How to Play
          </button>
        </div>
      </div>
    </div>
  );
}
