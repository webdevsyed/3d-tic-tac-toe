import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { CELL_SPACING, LAYER_GAP } from '../../utils/constants';
import { getSliceSplitOffset } from '../../utils/boardHelpers';
import type { SliceView } from '../../types/game';

interface CubeFrameProps {
  sliceView: SliceView;
  focusedSlice: number | null;
}

/**
 * Animated group for a single layer's grid lines + floor plane.
 */
function AnimatedLayerGrid({
  layerIndex,
  sliceView,
  focusedSlice,
  children,
}: {
  layerIndex: number;
  sliceView: SliceView;
  focusedSlice: number | null;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetOffset = getSliceSplitOffset(layerIndex, sliceView, focusedSlice);

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
 * - Grid lines for each layer (animated split on slice focus)
 * - Semi-transparent floor planes for depth/shading
 * - Vertical corner pillars (hidden when split)
 */
export function CubeFrame({ sliceView, focusedSlice }: CubeFrameProps) {
  const half = 1.5 * CELL_SPACING;
  const isSplitting = focusedSlice !== null && sliceView === 'horizontal';

  // Build per-layer grid lines
  const layers = [0, 1, 2].map((layer) => {
    const y = (1 - layer) * LAYER_GAP;
    const lines: Array<{ points: [number, number, number][]; opacity: number }> = [];

    for (let i = 0; i <= 3; i++) {
      const z = (i - 1.5) * CELL_SPACING;
      lines.push({
        points: [[-half, y, z], [half, y, z]],
        opacity: i === 0 || i === 3 ? 0.3 : 0.15,
      });
    }

    for (let i = 0; i <= 3; i++) {
      const x = (i - 1.5) * CELL_SPACING;
      lines.push({
        points: [[x, y, -half], [x, y, half]],
        opacity: i === 0 || i === 3 ? 0.3 : 0.15,
      });
    }

    return { layer, y, lines };
  });

  // Vertical corner pillars
  const pillarLines: Array<{ points: [number, number, number][]; opacity: number }> = [];
  const corners = [[-1.5, -1.5], [-1.5, 1.5], [1.5, -1.5], [1.5, 1.5]];
  for (const [xOff, zOff] of corners) {
    pillarLines.push({
      points: [
        [xOff * CELL_SPACING, LAYER_GAP, zOff * CELL_SPACING],
        [xOff * CELL_SPACING, -LAYER_GAP, zOff * CELL_SPACING],
      ],
      opacity: 0.25,
    });
  }

  return (
    <group>
      {layers.map(({ layer, y, lines }) => {
        const isFocused = isSplitting && layer === focusedSlice;
        const isDimmed = isSplitting && layer !== focusedSlice;

        return (
          <AnimatedLayerGrid
            key={`layer-${layer}`}
            layerIndex={layer}
            sliceView={sliceView}
            focusedSlice={sliceView === 'horizontal' ? focusedSlice : null}
          >
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                color="#ffffff"
                lineWidth={1.5}
                transparent
                opacity={isDimmed ? line.opacity * 0.3 : line.opacity}
              />
            ))}

            {/* Semi-transparent floor plane for depth */}
            <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[half * 2, half * 2]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={isFocused ? 0.06 : 0.025}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </AnimatedLayerGrid>
        );
      })}

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
