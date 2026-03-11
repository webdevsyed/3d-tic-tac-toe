import type { PlayerID } from '../../types/game';
import { PLAYER_COLORS } from '../../utils/constants';

interface GhostPreviewProps {
  position: [number, number, number];
  player: PlayerID;
}

export function GhostPreview({ position, player }: GhostPreviewProps) {
  const color = PLAYER_COLORS[player];

  if (player === 'P1') {
    const barSize: [number, number, number] = [0.5, 0.07, 0.07];
    return (
      <group position={position}>
        <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
          <boxGeometry args={barSize} />
          <meshBasicMaterial color={color} transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[0, -Math.PI / 4, -Math.PI / 4]}>
          <boxGeometry args={barSize} />
          <meshBasicMaterial color={color} transparent opacity={0.25} />
        </mesh>
      </group>
    );
  }

  if (player === 'P2') {
    return (
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      </group>
    );
  }

  // P3 - Triangular pyramid
  return (
    <group position={position}>
      <mesh rotation={[0, Math.PI / 6, 0]}>
        <coneGeometry args={[0.28, 0.45, 3]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
