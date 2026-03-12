interface CubeConfig {
  size: number;
  color: string;
  top: string;
  left: string;
  duration: number;
  reverse: boolean;
  opacity: number;
  delay: number;
}

const CUBES: CubeConfig[] = [
  // Top area
  { size: 55,  color: '#FF3D3D', top: '8%',  left: '12%', duration: 20, reverse: false, opacity: 0.12, delay: 0 },
  { size: 80,  color: '#3D8BFF', top: '5%',  left: '70%', duration: 28, reverse: true,  opacity: 0.09, delay: -5 },
  // Middle area
  { size: 35,  color: '#2DD881', top: '35%', left: '5%',  duration: 16, reverse: false, opacity: 0.13, delay: -8 },
  { size: 65,  color: '#FF3D3D', top: '42%', left: '85%', duration: 24, reverse: true,  opacity: 0.08, delay: -3 },
  // Bottom area
  { size: 45,  color: '#3D8BFF', top: '70%', left: '20%', duration: 18, reverse: true,  opacity: 0.11, delay: -12 },
  { size: 70,  color: '#2DD881', top: '78%', left: '75%', duration: 26, reverse: false, opacity: 0.10, delay: -7 },
  // Extra small accent cubes
  { size: 25,  color: '#FF3D3D', top: '55%', left: '45%', duration: 14, reverse: false, opacity: 0.07, delay: -10 },
];

function WireframeCube({ size, color, top, left, duration, reverse, opacity, delay }: CubeConfig) {
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
        animationDelay: `${delay}s`,
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

export function BackgroundCubes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: 800 }}>
      {CUBES.map((cube, i) => (
        <WireframeCube key={i} {...cube} />
      ))}
    </div>
  );
}
