import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { CELL_SPACING, LAYER_GAP } from '../../utils/constants';
import { getSliceSplitOffset } from '../../utils/boardHelpers';
import type { SliceView } from '../../types/game';

interface CubeFrameProps {
  sliceView: SliceView;
}

function AnimatedLayerGrid({
  layerIndex,
  sliceView,
  children,
}: {
  layerIndex: number;
  sliceView: SliceView;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetOffset = sliceView === 'horizontal'
    ? getSliceSplitOffset(layerIndex, sliceView)
    : [0, 0, 0] as [number, number, number];

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = 5;
    groupRef.current.position.x += (targetOffset[0] - groupRef.current.position.x) * Math.min(speed * delta, 1);
    groupRef.current.position.y += (targetOffset[1] - groupRef.current.position.y) * Math.min(speed * delta, 1);
    groupRef.current.position.z += (targetOffset[2] - groupRef.current.position.z) * Math.min(speed * delta, 1);
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * Full 3D Rubik's-cube-style grid: each cell has visible bounding edges.
 * Per layer: horizontal grids at top + bottom, vertical lines at all 16 intersections.
 */
export function CubeFrame({ sliceView }: CubeFrameProps) {
  const half = 1.5 * CELL_SPACING;
  const halfY = LAYER_GAP / 2;

  // Grid positions along X and Z (cell boundaries)
  const gridPos = [-1.5, -0.5, 0.5, 1.5].map((v) => v * CELL_SPACING);

  const layers = useMemo(() => [0, 1, 2].map((layer) => {
    const yCenter = (1 - layer) * LAYER_GAP;
    const yTop = yCenter + halfY;
    const yBot = yCenter - halfY;

    const lines: Array<{ points: [number, number, number][]; opacity: number }> = [];

    // Horizontal grids at top and bottom of this layer
    for (const y of [yTop, yBot]) {
      // Lines along X at each Z position
      for (const z of gridPos) {
        const isEdge = Math.abs(z) > CELL_SPACING;
        lines.push({
          points: [[-half, y, z], [half, y, z]],
          opacity: isEdge ? 0.35 : 0.18,
        });
      }
      // Lines along Z at each X position
      for (const x of gridPos) {
        const isEdge = Math.abs(x) > CELL_SPACING;
        lines.push({
          points: [[x, y, -half], [x, y, half]],
          opacity: isEdge ? 0.35 : 0.18,
        });
      }
    }

    // Vertical lines at every grid intersection (4×4 = 16 pillars per layer)
    for (const x of gridPos) {
      for (const z of gridPos) {
        const isCorner = Math.abs(x) > CELL_SPACING && Math.abs(z) > CELL_SPACING;
        const isEdge = Math.abs(x) > CELL_SPACING || Math.abs(z) > CELL_SPACING;
        lines.push({
          points: [[x, yTop, z], [x, yBot, z]],
          opacity: isCorner ? 0.35 : isEdge ? 0.25 : 0.15,
        });
      }
    }

    return { layer, yCenter, lines };
  }), [half, halfY, gridPos]);

  return (
    <group>
      {layers.map(({ layer, yCenter, lines }) => (
        <AnimatedLayerGrid
          key={`layer-${layer}`}
          layerIndex={layer}
          sliceView={sliceView}
        >
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              color="#ffffff"
              lineWidth={1}
              transparent
              opacity={line.opacity}
            />
          ))}

          {/* Semi-transparent box enclosure for depth */}
          <mesh position={[0, yCenter, 0]}>
            <boxGeometry args={[half * 2, LAYER_GAP * 0.95, half * 2]} />
            <meshStandardMaterial
              color="#8888ff"
              transparent
              opacity={0.03}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        </AnimatedLayerGrid>
      ))}
    </group>
  );
}
