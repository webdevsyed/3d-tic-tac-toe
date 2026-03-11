# 3D Tic-Tac-Toe — Comprehensive Game Plan

## Table of Contents
1. [Game Overview](#1-game-overview)
2. [Board Representation & 3D Visualization](#2-board-representation--3d-visualization)
3. [Player Interaction & Controls](#3-player-interaction--controls)
4. [Layer System](#4-layer-system)
5. [Game Rules & Win Conditions](#5-game-rules--win-conditions)
6. [Multiplayer Architecture](#6-multiplayer-architecture)
7. [UI/UX & Aesthetics](#7-uiux--aesthetics)
8. [Game Flow & Screens](#8-game-flow--screens)
9. [Edge Cases & Error Handling](#9-edge-cases--error-handling)
10. [Tech Stack & Project Structure](#10-tech-stack--project-structure)
11. [Implementation Phases](#11-implementation-phases)

---

## 1. Game Overview

A **3-player, real-time multiplayer** tic-tac-toe game played on a **3×3×3 cube** (27 cells). Players take turns placing 3D markers on the shared cube. The first player to claim 3 cells in a straight line wins.

### Players & Symbols
| Player | Symbol   | Color                  | Description                          |
|--------|----------|------------------------|--------------------------------------|
| P1     | 3D X     | `#FF3D3D` (Crimson)    | Two crossed bars with slight depth   |
| P2     | Sphere   | `#3D8BFF` (Electric Blue) | Smooth sphere with specular highlights |
| P3     | Pyramid  | `#2DD881` (Emerald)    | Tetrahedron with faceted faces       |

Each symbol is rendered as an actual 3D mesh (not flat icons) with materials, lighting, and shadows, giving them physical presence inside the cube.

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
- **Auto-rotate**: Gentle idle rotation when it's NOT the current player's turn (stops when it's your turn so you can aim)
- **Reset camera button**: Returns to the default view angle
- **Mobile**: Touch-drag to orbit, pinch to zoom

### 2.4 Rendering Approach

Using **React Three Fiber** (R3F) + **@react-three/drei** for helpers:

- The cube is built from programmatic geometry (not a loaded 3D model)
- Each cell is an invisible `<mesh>` with a box geometry that acts as a click target (raycast hit area)
- When a player places a mark, the 3D symbol animates into existence at that cell's position
- Lighting: One key directional light + ambient light + optional point lights on placed symbols for glow effect

---

## 3. Player Interaction & Controls

### 3.1 Placing a Mark

1. **Hover**: When hovering over an empty cell, it highlights (subtle glow / color pulse) and shows a **ghost preview** of the current player's symbol (semi-transparent) so they know exactly where they're placing
2. **Click**: Clicking an empty highlighted cell places the mark with an entrance animation:
   - **X**: Bars slam together from opposite directions
   - **Sphere**: Inflates from a point with a bounce ease
   - **Pyramid**: Drops in from above and lands with a slight wobble
3. **Occupied cells**: Hovering over an occupied cell shows a "blocked" cursor; clicking does nothing
4. **Not your turn**: All cells are non-interactive when it's not your turn. A subtle visual indicator shows whose turn it is

### 3.2 Layer Navigation (Optional Assist)

While orbit controls let players see any angle, we also provide a **layer focus mode**:

- **Layer buttons** (1 / 2 / 3) on the side panel let players focus on a single layer
- When focused, the other layers fade to very low opacity (15%) and the camera smoothly transitions to a top-down view of the selected layer
- **"Show All"** button returns to the default 3D view
- This helps players who find full 3D rotation disorienting

### 3.3 Winning Line Highlight

When a player wins:
- The 3 winning cells glow brightly in the winner's color
- A **beam/line** connects the 3 cells through the cube
- Non-winning cells dim to 30% opacity
- Confetti or particle burst in the winner's color
- All orbit controls still work so players can inspect the winning line

---

## 4. Layer System

### 4.1 Layer Definition

The cube has **3 horizontal layers** stacked vertically:

```
        ┌─────────────────┐
        │   Layer 0 (Top) │  y = +1
        ├─────────────────┤
        │  Layer 1 (Mid)  │  y =  0
        ├─────────────────┤
        │ Layer 2 (Bottom)│  y = -1
        └─────────────────┘
```

Each layer is a standard 3×3 grid. Layers are spaced apart vertically with enough gap so symbols on one layer don't visually overlap those on adjacent layers.

### 4.2 Layer Spacing & Visibility

- **Gap between layers**: ~1.2 units (enough to clearly see each layer)
- **Layer planes**: Optional translucent planes (glass-shelf effect) with very low opacity (~5%) to help perceive depth
- **Layer labels**: Small "L1", "L2", "L3" labels floating next to each layer (visible from any angle, using Billboard text from drei)
- **Depth cues**: Cells further from camera render slightly smaller (natural perspective) and with slightly lower opacity to reinforce depth perception

### 4.3 Layer Interaction

- All layers are always interactive (no need to "select" a layer first)
- Raycasting automatically detects which cell the cursor is pointing at regardless of which layer it's on
- The closest empty cell to the camera gets priority if rays pass through multiple cells (prevents accidentally clicking a back cell when aiming at a front one)

---

## 5. Game Rules & Win Conditions

### 5.1 Turn Order

- Turns rotate: **P1 → P2 → P3 → P1 → ...**
- Turn order is assigned when the game starts (first to join = P1, etc.)
- There is a **turn timer** of 30 seconds. If a player doesn't move in time:
  - First timeout: Warning toast
  - Second consecutive timeout: Auto-forfeit (player is eliminated, remaining 2 continue)
  - **Edge case**: If 2 players forfeit, the last remaining player wins by default

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

| Condition       | Result                                                    |
|-----------------|-----------------------------------------------------------|
| 3-in-a-row      | That player wins immediately; game ends                   |
| All 27 cells filled | Draw — no player wins                                 |
| 2 players forfeit   | Last remaining player wins by default                 |
| Player disconnects  | 30-second reconnect window; then treated as forfeit   |

### 5.4 Special Rules & Edge Cases

- **Simultaneous wins**: Impossible since players take turns (only one placement per turn)
- **First-player advantage**: In 3-player, the advantage is significantly diluted compared to 2-player. No special balancing needed for casual play
- **Stalemates**: With 3 players competing for 49 lines on 27 cells, draws are rare but possible. The game simply announces "Draw — no one wins"

---

## 6. Multiplayer Architecture

### 6.1 Tech Choice: Socket.io

**Why Socket.io over alternatives:**
- Built-in room management (perfect for our room-code system)
- Auto-reconnection with configurable timeouts
- Works across firewalls/proxies (falls back from WebSocket to polling)
- Simple event-based API

### 6.2 Room System

```
Create Game Flow:
  Player visits site → clicks "Create Game"
  → Server generates 4-char room code (e.g., "A3F9")
  → Player joins room as P1
  → Lobby screen shows room code + waiting status
  → Code can be copied/shared

Join Game Flow:
  Player visits site → clicks "Join Game"
  → Enters 4-char room code
  → Server validates: room exists? has space? game started?
  → Player joins as P2 or P3
  → All players see updated lobby

Game Start:
  Once 3 players are in the room → 3-second countdown → game begins
```

### 6.3 Game State (Server-Authoritative)

The server is the **single source of truth**. Clients send move requests; the server validates and broadcasts.

```typescript
interface GameState {
  roomCode: string;
  board: (null | 'P1' | 'P2' | 'P3')[][][];  // 3×3×3 array
  currentTurn: 'P1' | 'P2' | 'P3';
  players: {
    P1: { id: string; name: string; connected: boolean };
    P2: { id: string; name: string; connected: boolean };
    P3: { id: string; name: string; connected: boolean };
  };
  status: 'waiting' | 'playing' | 'finished';
  winner: null | 'P1' | 'P2' | 'P3' | 'draw';
  winningLine: null | [number, number, number][];  // 3 cell coordinates
  moveHistory: { player: string; cell: [number, number, number]; timestamp: number }[];
  turnStartTime: number;
}
```

### 6.4 Socket Events

| Event (Client → Server)   | Payload                          | Description                       |
|---------------------------|----------------------------------|-----------------------------------|
| `create-room`             | `{ playerName }`                 | Create a new game room            |
| `join-room`               | `{ roomCode, playerName }`       | Join an existing room             |
| `make-move`               | `{ layer, row, col }`            | Place a mark at coordinates       |

| Event (Server → Client)   | Payload                          | Description                       |
|---------------------------|----------------------------------|-----------------------------------|
| `room-created`            | `{ roomCode, playerRole }`       | Confirm room creation             |
| `player-joined`           | `{ playerName, playerRole, players }` | A new player joined          |
| `game-start`              | `{ gameState }`                  | All 3 players present, game begins|
| `move-made`               | `{ gameState }`                  | A valid move was made             |
| `invalid-move`            | `{ reason }`                     | Move rejected (not your turn, occupied, etc.) |
| `game-over`               | `{ winner, winningLine }`        | Game ended                        |
| `player-disconnected`     | `{ playerRole }`                 | A player lost connection          |
| `player-reconnected`      | `{ playerRole }`                 | A player reconnected              |
| `turn-timeout`            | `{ playerRole }`                 | A player's turn timed out         |
| `error`                   | `{ message }`                    | General error                     |

### 6.5 Server Validation (Anti-Cheat)

Every move is validated server-side:
- Is it this player's turn?
- Is the cell empty?
- Is the game still in progress?
- Is the cell within valid bounds (0-2 for each coordinate)?

Clients NEVER modify game state directly — they only render what the server sends.

### 6.6 Reconnection Handling

- Player disconnects → server starts 30-second timer
- Server broadcasts `player-disconnected` to others (shows "Player X reconnecting..." overlay)
- If player reconnects within 30s → server sends full `gameState` to restore them; game continues
- If timer expires → player is eliminated (forfeits remaining turns)
- If only 1 player remains → they win by default
- Socket.io's built-in reconnection handles transient network blips automatically

---

## 7. UI/UX & Aesthetics

### 7.1 Design Direction: "Neon Void"

Following the **frontend-design skill** philosophy — bold, distinctive, memorable:

**Tone**: Dark, futuristic, clean — like a holographic game floating in space. Inspired by Tron/cyberpunk aesthetics but refined and minimal, not cluttered.

**Key visual elements:**
- **Dark background**: Near-black (`#0A0A0F`) with subtle animated gradient mesh (very slow color shifts in deep blues/purples)
- **The cube**: Rendered with glowing neon wireframe edges against the dark void
- **Player colors**: Vivid, saturated neon — Red, Blue, Green — each with a subtle glow/bloom effect
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
│    │   ▸ CREATE GAME        │        │
│    ├────────────────────────┤        │
│    │   ▸ JOIN GAME          │        │
│    ├────────────────────────┤        │
│    │   ▸ HOW TO PLAY        │        │
│    └────────────────────────┘        │
│                                      │
│         [Enter your name: ___]       │
│                                      │
│  Animated 3D cube slowly rotating    │
│  in the background                   │
│                                      │
└──────────────────────────────────────┘
```

#### Lobby Screen (Waiting for Players)
```
┌──────────────────────────────────────┐
│  Room Code: [A 3 F 9]  📋 Copy      │
│                                      │
│  Players:                            │
│  ┌──────────────────────────────┐    │
│  │ ✕ P1: "Alice"    ● Ready    │    │
│  │ ◉ P2: "Bob"      ● Ready    │    │
│  │ △ P3: Waiting...  ○         │    │
│  └──────────────────────────────┘    │
│                                      │
│  Share this code with 2 friends!     │
│                                      │
│  [Small rotating cube preview]       │
│                                      │
│  [ Leave Room ]                      │
└──────────────────────────────────────┘
```

#### Game Screen
```
┌──────────────────────────────────────────────────────────┐
│  P1:Alice  ⬡  P2:Bob  ⬡  P3:Carol     Turn: P1 (00:25) │
│ ─────────────────────────────────────────────────────────│
│                                                          │
│                    ┌─────────┐                           │
│                    │         │   Layer                   │
│                    │  3D     │   [ 1 ]                   │
│                    │  CUBE   │   [ 2 ]                   │
│                    │  HERE   │   [ 3 ]                   │
│                    │         │   [All]                   │
│                    └─────────┘                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Move Log:  P1→(0,1,2)  P2→(1,1,1)  P3→(2,0,0)  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  [🔄 Reset View]                          [💬 Chat]     │
└──────────────────────────────────────────────────────────┘
```

#### Game Over Screen
```
┌──────────────────────────────────────┐
│                                      │
│          🎉 P2 WINS! 🎉              │
│          ── Bob ──                   │
│                                      │
│   [3D cube with winning line         │
│    highlighted and glowing]          │
│                                      │
│   Winning line: (0,0,0)→(1,1,1)→    │
│                 (2,2,2) [diagonal]   │
│                                      │
│   ┌────────────────────────┐         │
│   │   ▸ PLAY AGAIN         │         │
│   ├────────────────────────┤         │
│   │   ▸ BACK TO HOME       │         │
│   └────────────────────────┘         │
│                                      │
└──────────────────────────────────────┘
```

### 7.3 Responsive Design

| Breakpoint      | Layout                                                     |
|----------------|------------------------------------------------------------|
| Desktop (>1024px) | Side-by-side: 3D cube (70%) + info panel (30%)          |
| Tablet (768-1024) | Stacked: 3D cube on top, controls below                 |
| Mobile (<768px)   | Full-screen cube with floating overlay buttons; layer selector as bottom sheet |

### 7.4 Accessibility

- All interactive elements keyboard-navigable
- Layer buttons have aria-labels
- Game state changes announced via aria-live regions (e.g., "Player 2 placed Sphere at Layer 1, Row 2, Column 3")
- High contrast mode (optional toggle): white wireframe on black, bold player colors
- Symbols are distinguishable by shape (not just color) — ensures colorblind players can differentiate

---

## 8. Game Flow & Screens

### 8.1 Complete User Journey

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐
│  Home   │───▶│ Create/ │───▶│  Lobby  │───▶│  Game   │───▶│ Game     │
│ Screen  │    │  Join   │    │ (Wait)  │    │ (Play)  │    │ Over     │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └──────────┘
                                                               │       │
                                                               ▼       ▼
                                                          Play Again  Home
```

### 8.2 State Transitions

| From    | To       | Trigger                        |
|---------|----------|--------------------------------|
| Home    | Lobby    | Click Create/Join + valid name |
| Lobby   | Game     | 3rd player joins → countdown   |
| Game    | Game Over| Win / Draw / All forfeit       |
| Game Over| Lobby   | All players click "Play Again" |
| Game Over| Home    | Click "Back to Home"           |
| Any     | Home     | Player leaves / disconnects    |

### 8.3 "How to Play" Tutorial

A modal/overlay accessible from the home screen (and as a "?" button during the game):

1. **The Board**: "The game is played on a 3×3×3 cube — 27 cells across 3 layers"
2. **Taking Turns**: "3 players take turns placing their symbol. You have 30 seconds per turn."
3. **Winning**: "Get 3 of your symbols in a straight line — horizontally, vertically, or diagonally through the cube"
4. **Controls**: "Drag to rotate the cube. Scroll to zoom. Click a cell to place your mark."
5. **Layers**: "Use the layer buttons to focus on a single slice of the cube"

Short, visual, with animated diagrams showing example winning lines in the 3D cube.

---

## 9. Edge Cases & Error Handling

### 9.1 Network & Connection

| Scenario                          | Handling                                                    |
|-----------------------------------|-------------------------------------------------------------|
| Player loses internet mid-game    | 30s reconnect window; other players see "reconnecting" overlay; game pauses their turn timer |
| Player closes browser tab         | Same as disconnect — 30s window to rejoin with same session |
| Player refreshes page             | Socket.io reconnects automatically; server re-sends full state |
| Server crashes                    | All clients show "Connection lost" → auto-retry every 3s with backoff |
| Two players click at same time    | Server processes sequentially; only the current-turn player's move is valid |
| Player joins with same name       | Allowed — names are display-only; players are identified by socket ID + role |
| Room code collision               | Server ensures uniqueness by checking existing rooms before assigning |
| Very high latency (>2s)           | Show "Syncing..." indicator; moves are optimistic on client but confirmed by server |

### 9.2 Game Logic

| Scenario                             | Handling                                                 |
|--------------------------------------|----------------------------------------------------------|
| Player tries to move on occupied cell | Server rejects; client shows brief shake animation      |
| Player tries to move out of turn      | Server rejects with `invalid-move` event                |
| All 27 cells filled with no winner    | Server detects draw; sends `game-over` with `winner: 'draw'` |
| Player clicks during countdown       | Clicks ignored until countdown reaches 0                 |
| Turn timer expires                   | Server auto-skips turn; broadcasts `turn-timeout`        |
| Two consecutive timeouts by same player | Player is eliminated (auto-forfeit)                   |
| Only 1 player remains after forfeits | That player wins by default                              |
| Win on the last cell (27th move)     | Win takes priority over draw — check win first, then draw|
| Player tries to join a full room     | Server rejects with "Room is full" error                 |
| Player tries to join a started game  | Server rejects with "Game already in progress"           |
| Invalid room code                    | Server rejects with "Room not found"                     |
| Empty/whitespace player name         | Client-side validation; must be 1-15 chars, trimmed      |

### 9.3 UI/UX Edge Cases

| Scenario                          | Handling                                                    |
|-----------------------------------|-------------------------------------------------------------|
| Camera at awkward angle            | "Reset View" button always visible; auto-reset on layer focus |
| Player can't find empty cell       | Ghost preview on hover helps; layer focus mode isolates layers |
| Symbols overlapping visually       | Sufficient layer spacing (1.2 units); symbols sized at 60% of cell |
| Mobile touch conflicts (orbit vs. click) | Tap = place mark; drag = orbit; distinct gesture handling |
| Very small screen (<360px)         | Minimum supported width; cube scales down; UI simplified |
| Browser doesn't support WebGL      | Show fallback message: "Your browser doesn't support 3D graphics" |
| Browser tab in background          | Socket stays connected; no animation updates until tab is focused |

### 9.4 "Play Again" Logic

- After game over, all players see "Play Again" button
- When a player clicks it, their status shows as "Ready" to others
- If all 3 click "Play Again" → new game starts in same room with rotated turn order (P2 goes first this time)
- If some players leave → room goes back to lobby state; open slots can be filled by new players
- If all players leave → room is destroyed after 60 seconds

---

## 10. Tech Stack & Project Structure

### 10.1 Technology Choices

| Layer      | Technology                        | Purpose                           |
|------------|-----------------------------------|-----------------------------------|
| Frontend   | React 18 + TypeScript             | UI framework                      |
| 3D Engine  | React Three Fiber + drei          | 3D rendering & helpers            |
| Styling    | Tailwind CSS + CSS variables      | Utility styling + custom theme    |
| Animation  | Framer Motion + R3F spring        | UI transitions + 3D animations    |
| Bundler    | Vite                              | Fast dev server + production build|
| Backend    | Node.js + Express                 | HTTP server                       |
| WebSocket  | Socket.io                         | Real-time multiplayer             |
| State      | Zustand                           | Client-side state management      |
| Fonts      | Google Fonts (Orbitron, JetBrains Mono) | Typography                  |

### 10.2 Project Structure

```
3d-tic-tac-toe/
├── client/                        # Frontend (React + Vite)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── main.tsx               # App entry point
│   │   ├── App.tsx                # Router + layout
│   │   ├── index.css              # Global styles + Tailwind
│   │   │
│   │   ├── components/
│   │   │   ├── three/             # 3D components (R3F)
│   │   │   │   ├── GameBoard.tsx  # Main 3D cube scene
│   │   │   │   ├── Cell.tsx       # Individual cell (click target)
│   │   │   │   ├── SymbolX.tsx    # 3D X marker
│   │   │   │   ├── SymbolSphere.tsx   # 3D Sphere marker
│   │   │   │   ├── SymbolPyramid.tsx  # 3D Pyramid marker
│   │   │   │   ├── WinningLine.tsx    # Beam connecting winning cells
│   │   │   │   └── GhostPreview.tsx   # Semi-transparent preview on hover
│   │   │   │
│   │   │   ├── ui/                # 2D UI components
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   ├── LobbyScreen.tsx
│   │   │   │   ├── GameHUD.tsx    # Turn indicator, timer, player info
│   │   │   │   ├── GameOverOverlay.tsx
│   │   │   │   ├── LayerSelector.tsx
│   │   │   │   ├── MoveLog.tsx
│   │   │   │   ├── HowToPlay.tsx
│   │   │   │   └── Toast.tsx
│   │   │   │
│   │   │   └── shared/            # Shared components
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       └── Modal.tsx
│   │   │
│   │   ├── stores/
│   │   │   ├── gameStore.ts       # Zustand store for game state
│   │   │   └── uiStore.ts        # UI state (camera, modals, etc.)
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSocket.ts       # Socket.io connection + events
│   │   │   ├── useGameLogic.ts    # Game logic helpers
│   │   │   └── useTurnTimer.ts    # Turn countdown timer
│   │   │
│   │   ├── utils/
│   │   │   ├── winConditions.ts   # All 49 winning line definitions
│   │   │   ├── constants.ts       # Colors, sizes, timing values
│   │   │   └── helpers.ts         # Misc utilities
│   │   │
│   │   └── types/
│   │       └── game.ts            # TypeScript type definitions
│   │
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                        # Backend (Node + Socket.io)
│   ├── src/
│   │   ├── index.ts               # Server entry point
│   │   ├── socket/
│   │   │   ├── handlers.ts        # Socket event handlers
│   │   │   └── rooms.ts          # Room management logic
│   │   ├── game/
│   │   │   ├── gameState.ts       # Game state management
│   │   │   ├── validation.ts      # Move validation
│   │   │   └── winChecker.ts      # Win detection (49 lines)
│   │   └── utils/
│   │       ├── roomCodes.ts       # Room code generation
│   │       └── constants.ts       # Server constants
│   │
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                        # Shared types between client/server
│   └── types.ts
│
├── GAME_PLAN.md                   # This file
├── .gitignore
└── README.md
```

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
- Click a cell → symbol appears (local only, no multiplayer)

### Phase 2: Game Logic (Local)
- Implement turn rotation (P1 → P2 → P3)
- Code all 49 winning line checks
- Detect win / draw conditions
- Add move validation
- Add hover ghost preview
- Winning line highlight beam
- Game over screen

### Phase 3: UI & Screens
- Home screen with Create/Join buttons
- Lobby screen with room code display
- Game HUD (player indicators, turn timer, move log)
- Game over overlay with results
- Layer selector buttons + focus mode
- "How to Play" modal
- Responsive layout for mobile/tablet
- Apply "Neon Void" visual theme

### Phase 4: Multiplayer Backend
- Set up Express + Socket.io server
- Implement room creation/joining
- Server-side game state management
- Move validation on server
- Event broadcasting
- Turn timer on server
- Reconnection handling

### Phase 5: Connect Frontend ↔ Backend
- Wire up socket events to game store
- Create/join room flow
- Real-time move synchronization
- Reconnection UI
- "Play Again" flow
- Error handling toasts

### Phase 6: Polish & Deploy
- Entrance/exit animations for symbols
- Particle effects on win
- Sound effects (optional)
- Performance optimization (instanced meshes if needed)
- WebGL fallback detection
- Final responsive/mobile testing
- Deploy (frontend: Vercel/Netlify, backend: Fly.io/Railway)

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
