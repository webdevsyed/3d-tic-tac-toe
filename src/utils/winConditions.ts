import type { Board, BoardCoord, PlayerID } from '../types/game';

type WinLine = [BoardCoord, BoardCoord, BoardCoord];

function generateAllWinLines(): WinLine[] {
  const lines: WinLine[] = [];

  for (let layer = 0; layer < 3; layer++) {
    // Rows within each layer
    for (let row = 0; row < 3; row++) {
      lines.push([[layer, row, 0], [layer, row, 1], [layer, row, 2]]);
    }
    // Columns within each layer
    for (let col = 0; col < 3; col++) {
      lines.push([[layer, 0, col], [layer, 1, col], [layer, 2, col]]);
    }
    // Diagonals within each layer
    lines.push([[layer, 0, 0], [layer, 1, 1], [layer, 2, 2]]);
    lines.push([[layer, 0, 2], [layer, 1, 1], [layer, 2, 0]]);
  }

  // Pillars (vertical columns through layers)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      lines.push([[0, row, col], [1, row, col], [2, row, col]]);
    }
  }

  // Vertical-row diagonals (tilt front↔back across layers)
  for (let col = 0; col < 3; col++) {
    lines.push([[0, 0, col], [1, 1, col], [2, 2, col]]);
    lines.push([[0, 2, col], [1, 1, col], [2, 0, col]]);
  }

  // Vertical-col diagonals (tilt left↔right across layers)
  for (let row = 0; row < 3; row++) {
    lines.push([[0, row, 0], [1, row, 1], [2, row, 2]]);
    lines.push([[0, row, 2], [1, row, 1], [2, row, 0]]);
  }

  // Space diagonals (corner to corner)
  lines.push([[0, 0, 0], [1, 1, 1], [2, 2, 2]]);
  lines.push([[0, 0, 2], [1, 1, 1], [2, 2, 0]]);
  lines.push([[0, 2, 0], [1, 1, 1], [2, 0, 2]]);
  lines.push([[0, 2, 2], [1, 1, 1], [2, 0, 0]]);

  return lines;
}

export const ALL_WIN_LINES = generateAllWinLines();

export function checkWin(board: Board): { winner: PlayerID; line: BoardCoord[] } | null {
  for (const line of ALL_WIN_LINES) {
    const [a, b, c] = line;
    const va = board[a[0]][a[1]][a[2]];
    const vb = board[b[0]][b[1]][b[2]];
    const vc = board[c[0]][c[1]][c[2]];

    if (va && va === vb && vb === vc) {
      return { winner: va, line: [a, b, c] };
    }
  }
  return null;
}

export function checkDraw(board: Board): boolean {
  for (let l = 0; l < 3; l++) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[l][r][c] === null) return false;
      }
    }
  }
  return true;
}
