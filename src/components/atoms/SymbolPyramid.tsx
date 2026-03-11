import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAYER_COLORS, SYMBOL_LIGHT_DISTANCE, SYMBOL_LIGHT_INTENSITY } from '../../utils/constants';

interface SymbolPyramidProps {
  position: [number, number, number];
  dimmed?: boolean;
  highlighted?: boolean;
}

export function SymbolPyramid({ position, dimmed = false, highlighted = false }: SymbolPyramidProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && highlighted) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const color = PLAYER_COLORS.P3;
  const opacity = dimmed ? 0.3 : 1;
  const lightIntensity = highlighted ? SYMBOL_LIGHT_INTENSITY * 3 : SYMBOL_LIGHT_INTENSITY;

  return (
    <group position={position}>
      {/* Triangular pyramid: 3 radial segments, rotated so a face is toward camera */}
      <mesh ref={meshRef} rotation={[0, Math.PI / 6, 0]}>
        <coneGeometry args={[0.28, 0.45, 3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={highlighted ? 0.8 : 0.3}
          roughness={0.4}
          metalness={0.2}
          flatShading
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
