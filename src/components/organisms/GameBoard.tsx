import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import { useGameStore } from '../../stores/gameStore';
import { CubeFrame } from '../molecules/CubeFrame';
import { WinningLine } from '../molecules/WinningLine';
import { Cell } from '../atoms/Cell';
import { SymbolX } from '../atoms/SymbolX';
import { SymbolSphere } from '../atoms/SymbolSphere';
import { SymbolPyramid } from '../atoms/SymbolPyramid';
import { GhostPreview } from '../atoms/GhostPreview';
import { coordToPosition, getCellOpacity, getSliceIndex, getSliceSplitOffset } from '../../utils/boardHelpers';
import { DEFAULT_CAMERA_POSITION } from '../../utils/constants';
import type { BoardCoord, PlayerID, SliceView } from '../../types/game';

/**
 * Animated group that smoothly lerps to a target offset for slice splitting.
 */
function AnimatedSliceGroup({
  sliceIndex,
  sliceView,
  focusedSlice,
  children,
}: {
  sliceIndex: number;
  sliceView: SliceView;
  focusedSlice: number | null;
  children: React.ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const targetOffset = getSliceSplitOffset(sliceIndex, sliceView, focusedSlice);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = 5;
    groupRef.current.position.x += (targetOffset[0] - groupRef.current.position.x) * Math.min(speed * delta, 1);
    groupRef.current.position.y += (targetOffset[1] - groupRef.current.position.y) * Math.min(speed * delta, 1);
    groupRef.current.position.z += (targetOffset[2] - groupRef.current.position.z) * Math.min(speed * delta, 1);
  });

  return <group ref={groupRef}>{children}</group>;
}

function BoardScene() {
  const board = useGameStore((s) => s.board);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const screen = useGameStore((s) => s.screen);
  const winner = useGameStore((s) => s.winner);
  const winningLine = useGameStore((s) => s.winningLine);
  const sliceView = useGameStore((s) => s.sliceView);
  const focusedSlice = useGameStore((s) => s.focusedSlice);
  const placeMove = useGameStore((s) => s.placeMove);

  const [hoveredCoord, setHoveredCoord] = useState<BoardCoord | null>(null);

  const isInteractive = screen === 'playing';
  const isFinished = screen === 'finished';

  const isWinningCell = useCallback(
    (coord: BoardCoord): boolean => {
      if (!winningLine) return false;
      return winningLine.some(
        (wc) => wc[0] === coord[0] && wc[1] === coord[1] && wc[2] === coord[2]
      );
    },
    [winningLine]
  );

  const handleHover = useCallback((coord: BoardCoord | null) => {
    setHoveredCoord(coord);
  }, []);

  const renderSymbol = (player: PlayerID, position: [number, number, number], coord: BoardCoord) => {
    const dimmed = isFinished && winningLine !== null && !isWinningCell(coord);
    const highlighted = isFinished && isWinningCell(coord);
    const key = `symbol-${coord[0]}-${coord[1]}-${coord[2]}`;

    switch (player) {
      case 'P1':
        return <SymbolX key={key} position={position} dimmed={dimmed} highlighted={highlighted} />;
      case 'P2':
        return <SymbolSphere key={key} position={position} dimmed={dimmed} highlighted={highlighted} />;
      case 'P3':
        return <SymbolPyramid key={key} position={position} dimmed={dimmed} highlighted={highlighted} />;
    }
  };

  // Group cells by slice index for animated splitting (memoized)
  const sliceGroups = useMemo(() => {
    const groups: Map<number, Array<{ coord: BoardCoord; li: number; ri: number; ci: number; cellValue: PlayerID | null }>> = new Map();
    board.forEach((layer, li) =>
      layer.forEach((row, ri) =>
        row.forEach((cellValue, ci) => {
          const coord: BoardCoord = [li, ri, ci];
          const si = getSliceIndex(coord, sliceView);
          if (!groups.has(si)) groups.set(si, []);
          groups.get(si)!.push({ coord, li, ri, ci, cellValue });
        })
      )
    );
    return groups;
  }, [board, sliceView]);

  return (
    <>
      {/* Lighting — boosted for better visibility */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} />
      <pointLight position={[0, 6, 0]} intensity={1.2} distance={20} />

      {/* Cube wireframe with split support */}
      <CubeFrame sliceView={sliceView} focusedSlice={focusedSlice} />

      {/* Cells grouped by slice for animated splitting */}
      {Array.from(sliceGroups.entries()).map(([si, cells]) => (
        <AnimatedSliceGroup
          key={`slice-${si}`}
          sliceIndex={si}
          sliceView={sliceView}
          focusedSlice={focusedSlice}
        >
          {cells.map(({ coord, li, ri, ci, cellValue }) => {
            const position = coordToPosition(coord);
            const opacity = getCellOpacity(coord, sliceView, focusedSlice);
            const isHovered =
              hoveredCoord &&
              hoveredCoord[0] === li &&
              hoveredCoord[1] === ri &&
              hoveredCoord[2] === ci;

            return (
              <group key={`${li}-${ri}-${ci}`}>
                <Cell
                  position={position}
                  coord={coord}
                  occupied={cellValue !== null}
                  occupiedBy={cellValue}
                  currentPlayer={currentTurn}
                  isInteractive={isInteractive && opacity > 0.5}
                  opacity={opacity}
                  onPlace={placeMove}
                  onHover={handleHover}
                />
                {cellValue && renderSymbol(cellValue, position, coord)}
                {isHovered && !cellValue && isInteractive && opacity > 0.5 && (
                  <GhostPreview position={position} player={currentTurn} />
                )}
              </group>
            );
          })}
        </AnimatedSliceGroup>
      ))}

      {/* Winning line beam */}
      {winningLine && winner && winner !== 'draw' && (
        <WinningLine line={winningLine} winner={winner} />
      )}

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export function GameBoard() {
  return (
    <Canvas
      camera={{ position: DEFAULT_CAMERA_POSITION, fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <BoardScene />
    </Canvas>
  );
}
