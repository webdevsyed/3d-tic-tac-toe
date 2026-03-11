import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useCallback, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { CubeFrame } from '../molecules/CubeFrame';
import { WinningLine } from '../molecules/WinningLine';
import { Cell } from '../atoms/Cell';
import { SymbolX } from '../atoms/SymbolX';
import { SymbolSphere } from '../atoms/SymbolSphere';
import { SymbolPyramid } from '../atoms/SymbolPyramid';
import { GhostPreview } from '../atoms/GhostPreview';
import { coordToPosition, getCellOpacity } from '../../utils/boardHelpers';
import { DEFAULT_CAMERA_POSITION } from '../../utils/constants';
import type { BoardCoord, PlayerID } from '../../types/game';

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

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-4, -2, -3]} intensity={0.4} />
      <pointLight position={[0, 6, 0]} intensity={0.8} distance={15} />

      {/* Cube wireframe */}
      <CubeFrame />

      {/* Cells, symbols, and ghost previews */}
      {board.map((layer, li) =>
        layer.map((row, ri) =>
          row.map((cellValue, ci) => {
            const coord: BoardCoord = [li, ri, ci];
            const position = coordToPosition(coord);
            const opacity = getCellOpacity(coord, sliceView, focusedSlice);
            const isHovered =
              hoveredCoord &&
              hoveredCoord[0] === li &&
              hoveredCoord[1] === ri &&
              hoveredCoord[2] === ci;

            return (
              <group key={`${li}-${ri}-${ci}`}>
                {/* Clickable cell */}
                <Cell
                  position={position}
                  coord={coord}
                  occupied={cellValue !== null}
                  currentPlayer={currentTurn}
                  isInteractive={isInteractive && opacity > 0.5}
                  opacity={opacity}
                  onPlace={placeMove}
                  onHover={handleHover}
                />

                {/* Placed symbol */}
                {cellValue && renderSymbol(cellValue, position, coord)}

                {/* Ghost preview on hover */}
                {isHovered && !cellValue && isInteractive && opacity > 0.5 && (
                  <GhostPreview position={position} player={currentTurn} />
                )}
              </group>
            );
          })
        )
      )}

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
