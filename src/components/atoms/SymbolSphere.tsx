import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAYER_COLORS, SYMBOL_LIGHT_DISTANCE, SYMBOL_LIGHT_INTENSITY } from '../../utils/constants';

interface SymbolSphereProps {
  position: [number, number, number];
  dimmed?: boolean;
  highlighted?: boolean;
}

export function SymbolSphere({ position, dimmed = false, highlighted = false }: SymbolSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && highlighted) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const color = PLAYER_COLORS.P2;
  const opacity = dimmed ? 0.3 : 1;
  const lightIntensity = highlighted ? SYMBOL_LIGHT_INTENSITY * 3 : SYMBOL_LIGHT_INTENSITY;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={highlighted ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.3}
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
