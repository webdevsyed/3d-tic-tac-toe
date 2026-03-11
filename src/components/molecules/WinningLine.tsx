import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { BoardCoord, PlayerID } from '../../types/game';
import { CELL_SPACING, LAYER_GAP, PLAYER_COLORS } from '../../utils/constants';

interface WinningLineProps {
  line: BoardCoord[];
  winner: PlayerID;
}

function coordToPosition(coord: BoardCoord): [number, number, number] {
  const [layer, row, col] = coord;
  return [
    (col - 1) * CELL_SPACING,
    (1 - layer) * LAYER_GAP,
    (row - 1) * CELL_SPACING,
  ];
}

export function WinningLine({ line, winner }: WinningLineProps) {
  const color = PLAYER_COLORS[winner];
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 3) * 1;
    }
  });

  const points = line.map(coordToPosition);
  const midpoint: [number, number, number] = [
    (points[0][0] + points[2][0]) / 2,
    (points[0][1] + points[2][1]) / 2,
    (points[0][2] + points[2][2]) / 2,
  ];

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={4}
        transparent
        opacity={0.9}
      />
      {/* Pulsing glow at midpoint */}
      <pointLight
        ref={lightRef}
        position={midpoint}
        color={color}
        intensity={2}
        distance={6}
        decay={2}
      />
    </group>
  );
}
