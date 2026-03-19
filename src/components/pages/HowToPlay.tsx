interface HowToPlayProps {
  onClose: () => void;
}

export function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-void/90 animate-fade-in">
      <div className="glass-panel max-w-md w-full mx-5 p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold tracking-wider">How to Play</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-xl leading-none w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-0 text-sm text-white/70">
          <section className="pb-4 mb-4 border-b border-white/8">
            <h3 className="font-display text-xs font-bold tracking-wider text-white/70 uppercase mb-2">
              The Board
            </h3>
            <p>
              The game is played on a 3&times;3&times;3 cube &mdash; 27 cells arranged across 3
              layers. Think of it as 3 regular tic-tac-toe boards stacked on top of each other.
            </p>
          </section>

          <section className="pb-4 mb-4 border-b border-white/8">
            <h3 className="font-display text-xs font-bold tracking-wider text-white/70 uppercase mb-2">
              Players
            </h3>
            <p>
              3 players take turns placing their symbol. Pass the device between turns!
            </p>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-crimson">&#10005; Player 1</span>
              <span className="text-electric">&#9679; Player 2</span>
              <span className="text-emerald">&#9650; Player 3</span>
            </div>
          </section>

          <section className="pb-4 mb-4 border-b border-white/8">
            <h3 className="font-display text-xs font-bold tracking-wider text-white/70 uppercase mb-2">
              Winning
            </h3>
            <p>
              Get 3 of your symbols in a straight line &mdash; horizontally, vertically, or
              diagonally through the cube. There are 49 possible winning lines!
            </p>
          </section>

          <section className="pb-4 mb-4 border-b border-white/8">
            <h3 className="font-display text-xs font-bold tracking-wider text-white/70 uppercase mb-2">
              Controls
            </h3>
            <p>
              <strong>Drag</strong> to rotate the cube. <strong>Scroll/pinch</strong> to zoom.{' '}
              <strong>Tap</strong> a cell to place your mark. Use the <strong>slice view</strong>{' '}
              button to see the cube from different angles.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xs font-bold tracking-wider text-white/70 uppercase mb-2">
              Slice Views
            </h3>
            <p>
              Cycle between Horizontal, Vertical-X, and Vertical-Z views to see the cube sliced
              along different axes. Focus on individual slices to plan your strategy!
            </p>
          </section>
        </div>

        <button
          onClick={onClose}
          className="btn-neon w-full mt-6 text-sm"
          style={{
            borderColor: 'rgba(61, 139, 255, 0.4)',
            color: '#3D8BFF',
          }}
        >
          Got It
        </button>
      </div>
    </div>
  );
}
