import { useState, useCallback } from 'react';
import type { BoardCoord, PlayerID } from '../../types/game';
import { PLAYER_COLORS } from '../../utils/constants';

interface CellProps {
  position: [number, number, number];
  coord: BoardCoord;
  occupied: boolean;
  currentPlayer: PlayerID;
  isInteractive: boolean;
  opacity?: number;
  onPlace: (coord: BoardCoord) => void;
  onHover: (coord: BoardCoord | null) => void;
}

export function Cell({
  position,
  coord,
  occupied,
  currentPlayer,
  isInteractive,
  opacity = 1,
  onPlace,
  onHover,
}: CellProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (!isInteractive || occupied) return;
    onPlace(coord);
  }, [isInteractive, occupied, coord, onPlace]);

  const handlePointerEnter = useCallback(() => {
    if (!isInteractive || occupied) return;
    setHovered(true);
    onHover(coord);
  }, [isInteractive, occupied, coord, onHover]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    onHover(null);
  }, [onHover]);

  const showHighlight = hovered && isInteractive && !occupied;
  const playerColor = PLAYER_COLORS[currentPlayer];

  return (
    <group position={position}>
      {/* Invisible click target */}
      <mesh
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Cell slot indicator (faint dot when empty) */}
      {!occupied && (
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial
            color={showHighlight ? playerColor : '#ffffff'}
            transparent
            opacity={showHighlight ? 0.6 * opacity : 0.15 * opacity}
          />
        </mesh>
      )}

      {/* Hover highlight glow */}
      {showHighlight && (
        <mesh>
          <boxGeometry args={[0.85, 0.85, 0.85]} />
          <meshBasicMaterial
            color={playerColor}
            transparent
            opacity={0.08 * opacity}
          />
        </mesh>
      )}
    </group>
  );
}
