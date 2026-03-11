import { Line } from '@react-three/drei';
import { CELL_SPACING, LAYER_GAP } from '../../utils/constants';

/**
 * Renders the wireframe structure of the 3×3×3 cube:
 * - Outer boundary edges
 * - Grid lines for each layer
 */
export function CubeFrame() {
  const lines: Array<{ points: [number, number, number][]; opacity: number }> = [];
  // Generate grid lines for each of the 3 layers
  for (let layer = 0; layer < 3; layer++) {
    const y = (1 - layer) * LAYER_GAP;

    // Horizontal grid lines (along x)
    for (let i = 0; i <= 3; i++) {
      const z = (i - 1.5) * CELL_SPACING;
      lines.push({
        points: [
          [-1.5 * CELL_SPACING, y, z],
          [1.5 * CELL_SPACING, y, z],
        ],
        opacity: i === 0 || i === 3 ? 0.15 : 0.08,
      });
    }

    // Vertical grid lines (along z)
    for (let i = 0; i <= 3; i++) {
      const x = (i - 1.5) * CELL_SPACING;
      lines.push({
        points: [
          [x, y, -1.5 * CELL_SPACING],
          [x, y, 1.5 * CELL_SPACING],
        ],
        opacity: i === 0 || i === 3 ? 0.15 : 0.08,
      });
    }
  }

  // Vertical pillars at the 4 corners
  const cornerOffsets = [
    [-1.5, -1.5],
    [-1.5, 1.5],
    [1.5, -1.5],
    [1.5, 1.5],
  ];
  const topY = LAYER_GAP;
  const bottomY = -LAYER_GAP;

  for (const [xOff, zOff] of cornerOffsets) {
    lines.push({
      points: [
        [xOff * CELL_SPACING, topY, zOff * CELL_SPACING],
        [xOff * CELL_SPACING, bottomY, zOff * CELL_SPACING],
      ],
      opacity: 0.15,
    });
  }

  return (
    <group>
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
    </group>
  );
}
