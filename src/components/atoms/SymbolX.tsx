import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAYER_COLORS, SYMBOL_LIGHT_DISTANCE, SYMBOL_LIGHT_INTENSITY } from '../../utils/constants';

interface SymbolXProps {
  position: [number, number, number];
  dimmed?: boolean;
  highlighted?: boolean;
}

export function SymbolX({ position, dimmed = false, highlighted = false }: SymbolXProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && highlighted) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const color = PLAYER_COLORS.P1;
  const opacity = dimmed ? 0.3 : 1;
  const lightIntensity = highlighted ? SYMBOL_LIGHT_INTENSITY * 3 : SYMBOL_LIGHT_INTENSITY;
  // Bar long in X, thin in Y and Z — rotated around Y to form an X visible from all angles
  const barSize: [number, number, number] = [0.5, 0.07, 0.07];

  return (
    <group ref={groupRef} position={position}>
      {/* Bar 1 - diagonal (Z-axis rotation for consistent X shape from all angles) */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={barSize} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={highlighted ? 0.8 : 0.4}
          toneMapped={false}
          transparent={dimmed}
          opacity={opacity}
        />
      </mesh>
      {/* Bar 2 - other diagonal */}
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={barSize} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={highlighted ? 0.8 : 0.4}
          toneMapped={false}
          transparent={dimmed}
          opacity={opacity}
        />
      </mesh>
      <pointLight
        color={color}
        intensity={lightIntensity}
        distance={SYMBOL_LIGHT_DISTANCE}
        decay={2}
      />
    </group>
  );
}
