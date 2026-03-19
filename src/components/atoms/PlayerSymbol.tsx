import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { PlayerID } from '../../types/game';
import { PLAYER_COLORS, SYMBOL_LIGHT_DISTANCE, SYMBOL_LIGHT_INTENSITY } from '../../utils/constants';

interface PlayerSymbolProps {
  player: PlayerID;
  position: [number, number, number];
  dimmed?: boolean;
  highlighted?: boolean;
  ghost?: boolean;
}

interface MaterialProps {
  color: string;
  ghost: boolean;
  dimmed: boolean;
  highlighted: boolean;
  opacity: number;
  emissiveBase?: number;
  roughness?: number;
  metalness?: number;
  flatShading?: boolean;
}

const X_BAR: [number, number, number] = [0.5, 0.09, 0.09];

/** Switches between ghost (basic) and placed (standard) material. */
function SymbolMaterial({
  color, ghost, dimmed, highlighted, opacity,
  emissiveBase = 0.3, roughness, metalness, flatShading,
}: MaterialProps) {
  if (ghost) {
    return <meshBasicMaterial color={color} transparent opacity={opacity} />;
  }
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={highlighted ? 0.8 : emissiveBase}
      toneMapped={false}
      transparent={dimmed}
      opacity={opacity}
      roughness={roughness}
      metalness={metalness}
      flatShading={flatShading}
    />
  );
}

export function PlayerSymbol({
  player,
  position,
  dimmed = false,
  highlighted = false,
  ghost = false,
}: PlayerSymbolProps) {
  const groupRef = useRef<Group>(null);
  const color = PLAYER_COLORS[player];
  const opacity = ghost ? 0.2 : dimmed ? 0.3 : 1;
  const mat = { color, ghost, dimmed, highlighted, opacity };

  useFrame((_, delta) => {
    if (groupRef.current && highlighted) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {player === 'P1' && (
        <>
          <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
            <boxGeometry args={X_BAR} />
            <SymbolMaterial {...mat} emissiveBase={0.4} />
          </mesh>
          <mesh rotation={[0, -Math.PI / 4, -Math.PI / 4]}>
            <boxGeometry args={X_BAR} />
            <SymbolMaterial {...mat} emissiveBase={0.4} />
          </mesh>
        </>
      )}

      {player === 'P2' && (
        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <SymbolMaterial {...mat} roughness={0.2} metalness={0.3} />
        </mesh>
      )}

      {player === 'P3' && (
        <mesh rotation={[0, Math.PI / 6, 0]}>
          <coneGeometry args={[0.28, 0.45, 3]} />
          <SymbolMaterial {...mat} roughness={0.4} metalness={0.2} flatShading />
        </mesh>
      )}

      {!ghost && (
        <pointLight
          color={color}
          intensity={highlighted ? SYMBOL_LIGHT_INTENSITY * 3 : SYMBOL_LIGHT_INTENSITY}
          distance={SYMBOL_LIGHT_DISTANCE}
          decay={2}
        />
      )}
    </group>
  );
}
