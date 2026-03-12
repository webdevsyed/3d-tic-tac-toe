import { useGameStore } from '../../stores/gameStore';

const CUBES = [
  { size: 60,  color: '#FF3D3D', top: '15%', left: '10%', duration: 18, reverse: false, opacity: 0.12 },
  { size: 90,  color: '#3D8BFF', top: '60%', left: '80%', duration: 24, reverse: true,  opacity: 0.10 },
  { size: 40,  color: '#2DD881', top: '75%', left: '15%', duration: 15, reverse: false, opacity: 0.14 },
  { size: 70,  color: '#3D8BFF', top: '20%', left: '78%', duration: 20, reverse: true,  opacity: 0.08 },
  { size: 50,  color: '#FF3D3D', top: '45%', left: '50%', duration: 22, reverse: false, opacity: 0.06 },
];

function WireframeCube({ size, color, top, left, duration, reverse, opacity }: typeof CUBES[number]) {
  const faceStyle = { width: size, height: size, color };
  return (
    <div
      className="bg-cube"
      style={{
        '--size': `${size}px`,
        width: size,
        height: size,
        top,
        left,
        opacity,
        color,
        animationDuration: `${duration}s`,
        animationName: reverse ? 'cube-spin-reverse' : 'cube-spin',
      } as React.CSSProperties}
    >
      <div className="face face-front" style={faceStyle} />
      <div className="face face-back" style={faceStyle} />
      <div className="face face-left" style={faceStyle} />
      <div className="face face-right" style={faceStyle} />
      <div className="face face-top" style={faceStyle} />
      <div className="face face-bottom" style={faceStyle} />
    </div>
  );
}

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

      {/* Rotating wireframe cubes */}
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: 600 }}>
        {CUBES.map((cube, i) => (
          <WireframeCube key={i} {...cube} />
        ))}
      </div>

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
            className="btn-neon text-base py-4 w-full hover:scale-105 transition-transform"
            style={{
              borderColor: 'rgba(61, 139, 255, 0.3)',
              boxShadow: '0 0 30px rgba(61, 139, 255, 0.1)',
            }}
          >
            New Game
          </button>
          <button
            onClick={onShowHelp}
            className="btn-neon text-sm py-3 w-full opacity-60 hover:opacity-100"
          >
            How to Play
          </button>
        </div>
      </div>
    </div>
  );
}
