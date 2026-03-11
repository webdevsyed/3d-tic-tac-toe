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

/**
 * Animated group for a single layer's grid lines + box enclosure.
 */
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
  // Only animate horizontal splits for the grid structure
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
 * Renders the wireframe structure of the 3×3×3 cube with:
 * - Grid lines for each layer (animated split on horizontal view)
 * - Semi-transparent box enclosures for depth
 * - Vertical corner pillars (hidden when splitting)
 */
export function CubeFrame({ sliceView }: CubeFrameProps) {
  const half = 1.5 * CELL_SPACING;
  const isSplitting = sliceView !== 'none';

  // Build per-layer grid lines (memoized)
  const layers = useMemo(() => [0, 1, 2].map((layer) => {
    const y = (1 - layer) * LAYER_GAP;
    const lines: Array<{ points: [number, number, number][]; opacity: number }> = [];

    for (let i = 0; i <= 3; i++) {
      const z = (i - 1.5) * CELL_SPACING;
      lines.push({
        points: [[-half, y, z], [half, y, z]],
        opacity: i === 0 || i === 3 ? 0.45 : 0.25,
      });
    }

    for (let i = 0; i <= 3; i++) {
      const x = (i - 1.5) * CELL_SPACING;
      lines.push({
        points: [[x, y, -half], [x, y, half]],
        opacity: i === 0 || i === 3 ? 0.45 : 0.25,
      });
    }

    return { layer, y, lines };
  }), [half]);

  // Vertical corner pillars (memoized)
  const pillarLines = useMemo(() => {
    const lines: Array<{ points: [number, number, number][]; opacity: number }> = [];
    const corners = [[-1.5, -1.5], [-1.5, 1.5], [1.5, -1.5], [1.5, 1.5]];
    for (const [xOff, zOff] of corners) {
      lines.push({
        points: [
          [xOff * CELL_SPACING, LAYER_GAP, zOff * CELL_SPACING],
          [xOff * CELL_SPACING, -LAYER_GAP, zOff * CELL_SPACING],
        ],
        opacity: 0.35,
      });
    }
    return lines;
  }, []);

  return (
    <group>
      {layers.map(({ layer, y, lines }) => (
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
              lineWidth={1.5}
              transparent
              opacity={line.opacity}
            />
          ))}

          {/* Semi-transparent box enclosure for this layer */}
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[half * 2, LAYER_GAP * 0.85, half * 2]} />
            <meshStandardMaterial
              color="#8888ff"
              transparent
              opacity={0.04}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        </AnimatedLayerGrid>
      ))}

      {/* Vertical pillars - hide when splitting */}
      {!isSplitting && pillarLines.map((line, i) => (
        <Line
          key={`pillar-${i}`}
          points={line.points}
          color="#ffffff"
          lineWidth={1.5}
          transparent
          opacity={line.opacity}
        />
      ))}
    </group>
  );
}
