import type { PlayerID } from '../../types/game';
import { PLAYER_COLORS } from '../../utils/constants';

interface GhostPreviewProps {
  position: [number, number, number];
  player: PlayerID;
}

export function GhostPreview({ position, player }: GhostPreviewProps) {
  const color = PLAYER_COLORS[player];

  if (player === 'P1') {
    const barSize: [number, number, number] = [0.08, 0.08, 0.55];
    return (
      <group position={position}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={barSize} />
          <meshBasicMaterial color={color} transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
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

  // P3 - Pyramid
  return (
    <group position={position}>
      <mesh>
        <coneGeometry args={[0.3, 0.5, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
