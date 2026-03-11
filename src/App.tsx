import { useState } from 'react';
import { useGameStore } from './stores/gameStore';
import { HomeScreen } from './components/pages/HomeScreen';
import { PlayerSetup } from './components/pages/PlayerSetup';
import { HowToPlay } from './components/pages/HowToPlay';
import { GameBoard } from './components/organisms/GameBoard';
import { GameHUD } from './components/organisms/GameHUD';
import { TurnTransition } from './components/organisms/TurnTransition';
import { GameOverOverlay } from './components/organisms/GameOverOverlay';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const [showHelp, setShowHelp] = useState(false);

  const showBoard = screen === 'playing' || screen === 'transitioning' || screen === 'finished';

  return (
    <div className="relative w-full h-full bg-void">
      {/* 3D Board - always rendered when in game, behind overlays */}
      {showBoard && (
        <div className="absolute inset-0">
          <GameBoard />
        </div>
      )}

      {/* HUD overlay */}
      {showBoard && <GameHUD />}

      {/* Screen overlays */}
      {screen === 'home' && (
        <HomeScreen onShowHelp={() => setShowHelp(true)} />
      )}
      <PlayerSetup />
      <TurnTransition />
      <GameOverOverlay />

      {/* How to Play modal */}
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}
