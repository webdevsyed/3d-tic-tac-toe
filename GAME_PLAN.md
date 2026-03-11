# 3D Tic-Tac-Toe — Comprehensive Game Plan

## Table of Contents
1. [Game Overview](#1-game-overview)
2. [Board Representation & 3D Visualization](#2-board-representation--3d-visualization)
3. [Player Interaction & Controls](#3-player-interaction--controls)
4. [Slice View System](#4-slice-view-system)
5. [Game Rules & Win Conditions](#5-game-rules--win-conditions)
6. [Local Multiplayer (Pass-the-Phone)](#6-local-multiplayer-pass-the-phone)
7. [UI/UX & Aesthetics](#7-uiux--aesthetics)
8. [Game Flow & Screens](#8-game-flow--screens)
9. [Edge Cases & Error Handling](#9-edge-cases--error-handling)
10. [Tech Stack & Project Structure](#10-tech-stack--project-structure)
11. [Implementation Phases](#11-implementation-phases)
12. [Future Roadmap](#12-future-roadmap)

---

## 1. Game Overview

A **3-player tic-tac-toe** game played on a **3×3×3 cube** (27 cells) on a **single device**. Players take turns passing the device to each other (hot-seat / pass-the-phone style). The first player to claim 3 cells in a straight line wins.

### Players & Symbols
| Player | Symbol   | Color                     | Description                          |
|--------|----------|---------------------------|--------------------------------------|
| P1     | 3D X     | `#FF3D3D` (Crimson)       | Two crossed bars with slight depth   |
| P2     | Sphere   | `#3D8BFF` (Electric Blue) | Smooth sphere with specular highlights |
| P3     | Pyramid  | `#2DD881` (Emerald)       | Tetrahedron with faceted faces       |

Each symbol is rendered as an actual 3D mesh (not flat icons) with materials, lighting, and shadows, giving them physical presence inside the cube.

### Player-Colored Lighting
When a symbol is placed, a **point light** in that player's color is added at the cell position. This means:
- P1's X marks emit a soft crimson glow onto nearby surfaces
- P2's Spheres cast electric blue light
- P3's Pyramids radiate emerald light
- As the board fills up, the cube becomes a beautiful mix of colored lighting
- The light intensity is subtle enough to not wash out other symbols, but visible enough to immediately identify ownership

---

## 2. Board Representation & 3D Visualization

### 2.1 The Cube

The board is a **transparent 3×3×3 wireframe cube** floating in 3D space. Think of it as 27 small cells arranged in a Rubik's cube layout but see-through.

```
Coordinate System (x, y, z):
Each cell is addressed as [layer][row][col]

Layer 0 (Top):        Layer 1 (Middle):     Layer 2 (Bottom):
┌───┬───┬───┐         ┌───┬───┬───┐         ┌───┬───┬───┐
│0,0│0,1│0,2│         │0,0│0,1│0,2│         │0,0│0,1│0,2│
├───┼───┼───┤         ├───┼───┼───┤         ├───┼───┼───┤
│1,0│1,1│1,2│         │1,0│1,1│1,2│         │1,0│1,1│1,2│
├───┼───┼───┤         ├───┼───┼───┤         ├───┼───┼───┤
│2,0│2,1│2,2│         │2,0│2,1│2,2│         │2,0│2,1│2,2│
└───┴───┴───┘         └───┴───┴───┘         └───┴───┴───┘
```

### 2.2 Visual Structure

- **Outer shell**: Subtle wireframe edges defining the full cube boundary
- **Layer dividers**: Faint horizontal planes separating the 3 layers (like glass shelves)
- **Cell boundaries**: Thin grid lines on each layer so cells are clearly distinguishable
- **Cell slots**: Each of the 27 positions has a subtle "slot" indicator (faint dot or glow) showing it's clickable when empty
- **Background**: Dark gradient environment (deep space / void aesthetic — no distracting scene, all focus on the cube)

### 2.3 Camera & Perspective

- **Default view**: Isometric-like angle (slightly above and to the right, ~30° elevation) so all 3 layers are visible at once
- **Orbit controls**: Click-drag to rotate the cube freely (OrbitControls from drei)
- **Zoom**: Scroll to zoom in/out (clamped to min/max distance)
- **Auto-rotate**: Gentle idle rotation during the "pass the phone" transition screen (stops when it's the active player's turn so they can aim)
- **Reset camera button**: Returns to the default view angle
- **Mobile**: Touch-drag to orbit, pinch to zoom

### 2.4 Rendering Approach

Using **React Three Fiber** (R3F) + **@react-three/drei** for helpers:

- The cube is built from programmatic geometry (not a loaded 3D model)
- Each cell is an invisible `<mesh>` with a box geometry that acts as a click target (raycast hit area)
- When a player places a mark, the 3D symbol animates into existence at that cell's position
- **Lighting**: One key directional light + ambient light + **per-symbol point lights in player colors** for the colored glow effect
- Each placed symbol adds a `<pointLight>` at its position with the player's color, low intensity (~0.5), and small distance (~2 units) so the glow is localized

---

## 3. Player Interaction & Controls

### 3.1 Placing a Mark

1. **Hover**: When hovering over an empty cell, it highlights (subtle glow / color pulse in the current player's color) and shows a **ghost preview** of the current player's symbol (semi-transparent) so they know exactly where they're placing
2. **Click**: Clicking an empty highlighted cell places the mark with an entrance animation:
   - **X**: Bars slam together from opposite directions
   - **Sphere**: Inflates from a point with a bounce ease
   - **Pyramid**: Drops in from above and lands with a slight wobble
3. **Occupied cells**: Hovering over an occupied cell shows a "blocked" cursor; clicking does nothing

### 3.2 Winning Line Highlight

When a player wins:
- The 3 winning cells glow brightly in the winner's color (point light intensity boosted)
- A **beam/line** connects the 3 cells through the cube
- Non-winning cells dim to 30% opacity
- Confetti or particle burst in the winner's color
- All orbit controls still work so players can inspect the winning line

---

## 4. Slice View System

### 4.1 Three Slice Orientations

The cube can be viewed as slices along **3 different axes**, cycled via a button:

```
View 1: HORIZONTAL (Y-axis slices) — Default
Splits the cube into 3 horizontal layers (top, middle, bottom)
Like looking at floors of a building from above

  ┌─────┐     ┌─────┐     ┌─────┐
  │ Top │     │ Mid │     │ Bot │
  │Layer│     │Layer│     │Layer│
  └─────┘     └─────┘     └─────┘

View 2: VERTICAL-X (X-axis slices)
Splits the cube into 3 vertical slices (left, center, right)
Like looking at slices of bread from the side

  ┌─────┐     ┌─────┐     ┌─────┐
  │Left │     │ Mid │     │Right│
  │Slice│     │Slice│     │Slice│
  └─────┘     └─────┘     └─────┘

View 3: VERTICAL-Z (Z-axis slices)
Splits the cube into 3 vertical slices (front, center, back)
Like looking at slices from the front

  ┌─────┐     ┌─────┐     ┌─────┐
  │Front│     │ Mid │     │Back │
  │Slice│     │Slice│     │Slice│
  └─────┘     └─────┘     └─────┘
```

### 4.2 Slice Controls

- **Cycle button**: A prominent button labeled with the current view mode (e.g., "Horizontal ↻") that cycles through the 3 orientations
- **Slice selector** (1 / 2 / 3 buttons): Focus on a specific slice within the current orientation
  - When focused, the other 2 slices fade to very low opacity (15%)
  - Camera smoothly transitions to face the selected slice head-on
- **"Show All"** button: Returns to the default 3D view with all slices visible
- When cycling the view orientation, the camera automatically animates to a good viewing angle for that axis

### 4.3 Future Enhancement: Gesture-Based Splitting
> _Planned for a later version:_ Two-finger spread gesture on mobile to "pull apart" the cube along the nearest axis, with the split direction determined by the gesture direction. For now, the button-based cycling approach works well and is simpler to implement.

---

## 5. Game Rules & Win Conditions

### 5.1 Turn Order

- Turns rotate: **P1 → P2 → P3 → P1 → ...**
- Players are assigned at game setup (enter 3 names)
- No turn timer in local mode (players are physically present, can nudge each other)
- A "Pass the Phone" transition screen appears between turns (see Section 6)

### 5.2 Winning Lines

A player wins by claiming **any 3 cells that form a straight line** through the cube. There are **49 possible winning lines** in a 3×3×3 cube:

| Category                    | Count | Description                                                 |
|-----------------------------|-------|-------------------------------------------------------------|
| Rows (within layers)        | 9     | 3 rows × 3 layers                                          |
| Columns (within layers)     | 9     | 3 cols × 3 layers                                          |
| Layer diagonals             | 6     | 2 diagonals × 3 layers                                     |
| Pillars (vertical)          | 9     | 3×3 vertical columns through all layers                     |
| Vertical-row diagonals      | 6     | Diagonals across layers along rows (front-to-back tilt)     |
| Vertical-col diagonals      | 6     | Diagonals across layers along columns (left-to-right tilt)  |
| Space diagonals             | 4     | Corner-to-corner through the cube's center                  |
| **Total**                   | **49**|                                                             |

### 5.3 End Conditions

| Condition           | Result                          |
|---------------------|---------------------------------|
| 3-in-a-row          | That player wins immediately    |
| All 27 cells filled | Draw — no player wins           |

### 5.4 Special Rules & Edge Cases

- **Simultaneous wins**: Impossible since players take turns (only one placement per turn)
- **First-player advantage**: In 3-player, the advantage is significantly diluted compared to 2-player. No special balancing needed for casual play
- **Stalemates**: With 3 players competing for 49 lines on 27 cells, draws are rare but possible. The game simply announces "Draw — no one wins"

---

## 6. Local Multiplayer (Pass-the-Phone)

### 6.1 How It Works

This is the **simplest multiplayer model**: all 3 players share one device, physically passing it between turns. No server, no network — just pure local state.

### 6.2 Game Setup Flow

```
Home Screen → Click "New Game"
  → Enter Player Names:
    ┌──────────────────────────┐
    │ Player 1 (✕): [Alice  ] │  ← Crimson
    │ Player 2 (●): [Bob    ] │  ← Blue
    │ Player 3 (▲): [Carol  ] │  ← Green
    │                          │
    │       [ START GAME ]     │
    └──────────────────────────┘
  → 3-second countdown → Game begins
```

### 6.3 Turn Transition ("Pass the Phone" Screen)

Between each turn, a **full-screen transition overlay** appears:

```
┌──────────────────────────────────┐
│                                  │
│      🔄 PASS TO:                 │
│                                  │
│      ╔════════════════╗          │
│      ║   BOB's TURN   ║          │
│      ║   (● Sphere)   ║          │
│      ╚════════════════╝          │
│                                  │
│      [ TAP TO START TURN ]       │
│                                  │
│  This prevents the next player   │
│  from seeing where the previous  │
│  player was looking on the cube  │
│  (no peeking at strategy!)       │
│                                  │
└──────────────────────────────────┘
```

**Why this matters:**
- Prevents the next player from seeing the previous player's camera angle (strategic info)
- Gives a clear "handoff" moment
- The overlay is in the current player's color
- Tap/click to dismiss and start your turn
- The cube resets to the default camera angle when the overlay is dismissed

### 6.4 Anti-Peek: Camera Reset

When the turn transition screen is dismissed:
- Camera smoothly animates back to the **default isometric angle**
- This ensures every player starts their turn from the same neutral viewpoint
- Players can then rotate freely to find their preferred angle

### 6.5 State Management

All game state lives in the client (Zustand store):

```typescript
interface GameState {
  board: (null | 'P1' | 'P2' | 'P3')[][][];  // 3×3×3 array
  currentTurn: 'P1' | 'P2' | 'P3';
  players: {
    P1: { name: string };
    P2: { name: string };
    P3: { name: string };
  };
  status: 'setup' | 'transitioning' | 'playing' | 'finished';
  winner: null | 'P1' | 'P2' | 'P3' | 'draw';
  winningLine: null | [number, number, number][];  // 3 cell coordinates
  moveHistory: { player: string; cell: [number, number, number] }[];
  sliceView: 'horizontal' | 'vertical-x' | 'vertical-z';
  focusedSlice: null | 0 | 1 | 2;  // which slice is focused, null = show all
}
```

---

## 7. UI/UX & Aesthetics

### 7.1 Design Direction: "Neon Void"

**Tone**: Dark, futuristic, clean — like a holographic game floating in space. Inspired by Tron/cyberpunk aesthetics but refined and minimal, not cluttered.

**Key visual elements:**
- **Dark background**: Near-black (`#0A0A0F`) with subtle animated gradient mesh (very slow color shifts in deep blues/purples)
- **The cube**: Rendered with glowing neon wireframe edges against the dark void
- **Player colors**: Vivid, saturated neon — Red, Blue, Green — each with a subtle glow/bloom effect
- **Player-colored cell lighting**: Placed symbols emit light in their player's color, making the cube a living light map of the game state
- **Typography**: Geometric, futuristic display font (e.g., "Orbitron" or "Rajdhani") for headings; clean mono font (e.g., "JetBrains Mono") for codes/data
- **UI panels**: Dark glass-morphism panels with blurred backgrounds and thin border glow
- **Animations**: Smooth, deliberate — nothing fast or jarring. Easing curves that feel physical

### 7.2 Screen Layouts

#### Home Screen
```
┌──────────────────────────────────────┐
│                                      │
│         ╔═══════════════╗            │
│         ║  3D TIC-TAC-TOE ║          │
│         ║   × 3 PLAYERS   ║          │
│         ╚═══════════════╝            │
│                                      │
│    ┌────────────────────────┐        │
│    │   ▸ NEW GAME            │        │
│    ├────────────────────────┤        │
│    │   ▸ HOW TO PLAY         │        │
│    └────────────────────────┘        │
│                                      │
│  Animated 3D cube slowly rotating    │
│  in the background                   │
│                                      │
└──────────────────────────────────────┘
```

#### Player Setup Screen
```
┌──────────────────────────────────────┐
│                                      │
│         ENTER PLAYER NAMES           │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ ✕ Player 1: [___________]   │    │  ← Crimson border
│  │ ● Player 2: [___________]   │    │  ← Blue border
│  │ ▲ Player 3: [___________]   │    │  ← Green border
│  └──────────────────────────────┘    │
│                                      │
│         [ START GAME ]               │
│                                      │
│  [Small rotating cube preview]       │
│                                      │
└──────────────────────────────────────┘
```

#### Game Screen
```
┌──────────────────────────────────────────────────────────┐
│  ✕ Alice   ● Bob   ▲ Carol          Turn: ● Bob         │
│ ─────────────────────────────────────────────────────────│
│                                                          │
│                    ┌─────────┐                           │
│                    │         │   Slice View              │
│                    │  3D     │   [Horizontal ↻]          │
│                    │  CUBE   │                           │
│                    │  HERE   │   Focus Slice             │
│                    │         │   [ 1 ][ 2 ][ 3 ]         │
│                    └─────────┘   [ Show All ]            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Move Log:  ✕→(0,1,2)  ●→(1,1,1)  ▲→(2,0,0)     │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  [Reset View]                                [? Help]    │
└──────────────────────────────────────────────────────────┘
```

#### Game Over Screen
```
┌──────────────────────────────────────┐
│                                      │
│           ● BOB WINS!                │
│                                      │
│   [3D cube with winning line         │
│    highlighted and glowing,          │
│    winner's color lighting           │
│    dominating the scene]             │
│                                      │
│   ┌────────────────────────┐         │
│   │   ▸ PLAY AGAIN         │         │
│   ├────────────────────────┤         │
│   │   ▸ NEW PLAYERS        │         │
│   ├────────────────────────┤         │
│   │   ▸ BACK TO HOME       │         │
│   └────────────────────────┘         │
│                                      │
└──────────────────────────────────────┘
```

### 7.3 Responsive Design

| Breakpoint        | Layout                                                     |
|-------------------|------------------------------------------------------------|
| Desktop (>1024px) | Side-by-side: 3D cube (70%) + info panel (30%)             |
| Tablet (768-1024) | Stacked: 3D cube on top, controls below                    |
| Mobile (<768px)   | Full-screen cube with floating overlay buttons; slice selector as bottom sheet |

### 7.4 Accessibility

- All interactive elements keyboard-navigable
- Slice buttons have aria-labels
- Game state changes announced via aria-live regions (e.g., "Bob placed Sphere at Layer 1, Row 2, Column 3")
- Symbols are distinguishable by shape (not just color) — ensures colorblind players can differentiate

---

## 8. Game Flow & Screens

### 8.1 Complete User Journey

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌─────────┐    ┌──────────┐
│  Home   │───▶│ Player   │───▶│ Pass-the- │───▶│  Game   │───▶│ Game     │
│ Screen  │    │ Setup    │    │ Phone     │    │ (Play)  │    │ Over     │
└─────────┘    └──────────┘    │ Transition│    └────┬────┘    └──────────┘
                               └─────┬─────┘         │          │    │    │
                                     └────────────────┘     Play  New  Home
                                     (repeats each turn)   Again  Plrs
```

### 8.2 State Transitions

| From        | To          | Trigger                            |
|-------------|-------------|------------------------------------|
| Home        | Setup       | Click "New Game"                   |
| Setup       | Transition  | Click "Start Game" (all 3 names entered) |
| Transition  | Game        | Active player taps "Start Turn"    |
| Game        | Transition  | Player places a mark (next player's turn) |
| Game        | Game Over   | Win or Draw detected               |
| Game Over   | Transition  | Click "Play Again" (same players, rotated turn order) |
| Game Over   | Setup       | Click "New Players"                |
| Game Over   | Home        | Click "Back to Home"               |

### 8.3 "How to Play" Tutorial

A modal/overlay accessible from the home screen (and as a "?" button during the game):

1. **The Board**: "The game is played on a 3×3×3 cube — 27 cells across 3 layers"
2. **Taking Turns**: "3 players take turns placing their symbol. Pass the device between turns!"
3. **Winning**: "Get 3 of your symbols in a straight line — horizontally, vertically, or diagonally through the cube"
4. **Controls**: "Drag to rotate the cube. Scroll to zoom. Click a cell to place your mark."
5. **Slice Views**: "Use the slice view button to see the cube from different angles — horizontal, vertical-X, or vertical-Z slices"

Short, visual, with animated diagrams showing example winning lines in the 3D cube.

---

## 9. Edge Cases & Error Handling

### 9.1 Game Logic

| Scenario                             | Handling                                                 |
|--------------------------------------|----------------------------------------------------------|
| Player taps occupied cell            | Brief shake animation; nothing happens                   |
| Player taps cell during transition   | Transition overlay blocks all cube interaction            |
| All 27 cells filled with no winner   | Draw screen shown                                        |
| Win on the last cell (27th move)     | Win takes priority over draw — check win first, then draw|
| Empty/whitespace player name         | Client-side validation; must be 1-15 chars, trimmed      |
| Duplicate player names               | Allowed — each player has a unique color/symbol anyway    |
| Player accidentally refreshes page   | Game state lost (localStorage persistence as future enhancement) |

### 9.2 UI/UX Edge Cases

| Scenario                                 | Handling                                                    |
|------------------------------------------|-------------------------------------------------------------|
| Camera at awkward angle                  | "Reset View" button always visible; auto-reset on turn transition |
| Player can't find empty cell             | Ghost preview on hover helps; slice focus mode isolates slices |
| Symbols overlapping visually             | Sufficient layer spacing (1.2 units); symbols sized at 60% of cell |
| Mobile touch conflicts (orbit vs. click) | Tap = place mark; drag = orbit; distinct gesture handling |
| Very small screen (<360px)               | Minimum supported width; cube scales down; UI simplified |
| Browser doesn't support WebGL            | Show fallback message: "Your browser doesn't support 3D graphics" |
| Too many point lights (performance)      | Cap at 27 max; use low intensity; disable on low-end devices |

### 9.3 "Play Again" Logic

- After game over, "Play Again" keeps the same 3 player names
- Turn order rotates: if P1 started last game, P2 starts this one
- Board resets to empty; all lights cleared
- "New Players" goes back to the name entry screen

---

## 10. Tech Stack & Project Structure

### 10.1 Technology Choices

| Layer      | Technology                              | Purpose                           |
|------------|-----------------------------------------|-----------------------------------|
| Frontend   | React 18 + TypeScript                   | UI framework                      |
| 3D Engine  | React Three Fiber + @react-three/drei   | 3D rendering & helpers            |
| Styling    | Tailwind CSS + CSS variables            | Utility styling + custom theme    |
| Animation  | @react-three/drei (useSpring) + CSS     | 3D + UI animations                |
| Bundler    | Vite                                    | Fast dev server + production build|
| State      | Zustand                                 | Client-side state management      |
| Fonts      | Google Fonts (Orbitron, JetBrains Mono) | Typography                        |
| Deployment | Netlify                                 | Static site hosting (free tier)   |

**No backend needed** — everything runs client-side. Netlify serves the static Vite build.

### 10.2 Project Structure

```
3d-tic-tac-toe/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                   # App entry point
│   ├── App.tsx                    # Router + layout
│   ├── index.css                  # Global styles + Tailwind
│   │
│   ├── components/
│   │   ├── three/                 # 3D components (R3F)
│   │   │   ├── GameBoard.tsx      # Main 3D cube scene (Canvas + lights)
│   │   │   ├── CubeFrame.tsx      # Wireframe cube structure
│   │   │   ├── Cell.tsx           # Individual cell (click target + highlight)
│   │   │   ├── SymbolX.tsx        # 3D X marker + point light
│   │   │   ├── SymbolSphere.tsx   # 3D Sphere marker + point light
│   │   │   ├── SymbolPyramid.tsx  # 3D Pyramid marker + point light
│   │   │   ├── WinningLine.tsx    # Beam connecting winning cells
│   │   │   └── GhostPreview.tsx   # Semi-transparent preview on hover
│   │   │
│   │   └── ui/                    # 2D UI components
│   │       ├── HomeScreen.tsx
│   │       ├── PlayerSetup.tsx    # Name entry for 3 players
│   │       ├── TurnTransition.tsx # "Pass the phone" overlay
│   │       ├── GameHUD.tsx        # Turn indicator, player info
│   │       ├── GameOverOverlay.tsx
│   │       ├── SliceControls.tsx  # Slice view cycle + focus buttons
│   │       ├── MoveLog.tsx
│   │       └── HowToPlay.tsx
│   │
│   ├── stores/
│   │   └── gameStore.ts           # Zustand store for all game state
│   │
│   ├── hooks/
│   │   └── useGameLogic.ts        # Game logic: place mark, check win, etc.
│   │
│   ├── utils/
│   │   ├── winConditions.ts       # All 49 winning line definitions
│   │   └── constants.ts           # Colors, sizes, player config
│   │
│   └── types/
│       └── game.ts                # TypeScript type definitions
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── netlify.toml                   # Netlify deploy config
├── package.json
├── GAME_PLAN.md                   # This file
└── .gitignore
```

### 10.3 Netlify Deployment

Since this is a **pure static site** (no server), Netlify deployment is straightforward:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- Push to GitHub → Netlify auto-deploys
- Free tier is plenty for a static site
- Custom domain optional
- No server costs, no backend infrastructure

---

## 11. Implementation Phases

### Phase 1: Project Setup & Static 3D Board
- Initialize Vite + React + TypeScript project
- Set up Tailwind CSS
- Install R3F, drei, three
- Build the static 3×3×3 cube wireframe
- Render all 27 cells as clickable targets
- Implement orbit controls + camera reset
- Add the 3 symbol meshes (X, Sphere, Pyramid)
- **Add per-symbol point lights in player colors**
- Click a cell → symbol appears (hardcoded player, no turns yet)

### Phase 2: Game Logic & Local Multiplayer
- Implement Zustand game store
- Turn rotation (P1 → P2 → P3)
- Code all 49 winning line checks
- Detect win / draw conditions
- Add move validation (occupied cell rejection)
- Add hover ghost preview
- Winning line highlight beam
- **Pass-the-phone transition screen**
- Camera reset on turn change

### Phase 3: Slice View System
- Implement 3 slice orientations (horizontal, vertical-X, vertical-Z)
- Cycle button to switch between views
- Slice focus buttons (1/2/3) to isolate a single slice
- Camera animation when switching views
- Opacity fading for unfocused slices
- "Show All" button to return to full 3D view

### Phase 4: UI Screens & Polish
- Home screen with rotating cube background
- Player name entry screen
- Game HUD (player indicators, current turn)
- Game over overlay with results
- Move log
- "How to Play" modal
- Responsive layout for mobile/tablet/desktop
- Apply "Neon Void" visual theme
- Entrance animations for symbols
- Particle effects on win

### Phase 5: Deploy to Netlify
- Add netlify.toml config
- Production build optimization
- WebGL fallback detection
- Final responsive/mobile testing
- Deploy to Netlify

---

## 12. Future Roadmap

These features are **not in scope** for the initial build but are planned for future iterations:

### v2: Online Multiplayer
- Add Socket.io backend (Express + Node.js)
- Room-code system (create/join with 4-char codes)
- Server-authoritative game state
- Reconnection handling
- Deploy backend to Fly.io or Railway
- Turn timer (30 seconds)

### v3: AI Opponent
- Single-player mode (play against AI)
- AI difficulty levels:
  - Easy: Random moves
  - Medium: Blocks obvious wins, takes winning moves
  - Hard: Minimax or similar algorithm adapted for 3-player

### v4: Enhanced Interactions
- Two-finger spread gesture to split cube along nearest axis
- Haptic feedback on mobile
- Sound effects
- localStorage game persistence (resume after refresh)
- Spectator mode for online games
- Game replay / move-by-move playback

---

## Appendix A: All 49 Winning Lines

Notation: `[layer, row, col]`

### Within-layer lines (24 total = 8 per layer × 3 layers)

**Layer 0 (Top):**
- Rows: `[0,0,0]-[0,0,1]-[0,0,2]`, `[0,1,0]-[0,1,1]-[0,1,2]`, `[0,2,0]-[0,2,1]-[0,2,2]`
- Cols: `[0,0,0]-[0,1,0]-[0,2,0]`, `[0,0,1]-[0,1,1]-[0,2,1]`, `[0,0,2]-[0,1,2]-[0,2,2]`
- Diags: `[0,0,0]-[0,1,1]-[0,2,2]`, `[0,0,2]-[0,1,1]-[0,2,0]`

**Layer 1 (Middle):** Same pattern with layer=1
**Layer 2 (Bottom):** Same pattern with layer=2

### Cross-layer lines (25 total)

**Pillars — 9 vertical columns:**
- `[0,r,c]-[1,r,c]-[2,r,c]` for all 9 combinations of r∈{0,1,2}, c∈{0,1,2}

**Vertical-row diagonals — 6 lines (tilt front↔back across layers):**
- For each col c: `[0,0,c]-[1,1,c]-[2,2,c]` and `[0,2,c]-[1,1,c]-[2,0,c]`

**Vertical-col diagonals — 6 lines (tilt left↔right across layers):**
- For each row r: `[0,r,0]-[1,r,1]-[2,r,2]` and `[0,r,2]-[1,r,1]-[2,r,0]`

**Space diagonals — 4 lines (corner to corner through center):**
- `[0,0,0]-[1,1,1]-[2,2,2]`
- `[0,0,2]-[1,1,1]-[2,2,0]`
- `[0,2,0]-[1,1,1]-[2,0,2]`
- `[0,2,2]-[1,1,1]-[2,0,0]`
