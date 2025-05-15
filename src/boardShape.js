// boardShape.js
// true = playable cell, false = empty (hole)
// This shape is based on the real Penguin Ice Breaker game board in your image

export const BOARD_MASK = [
  [false, false, true,  true,  true, false, false],
  [true, true,  true,  true,  true,  true, false],
  [false,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  false ],
  [false,  true,  true,  true,  true,  true,  true ],
  [true, true,  true,  true,  true,  true, false],
  [false, false, true,  true,  true, false, false],
];

/**
 * Returns a randomized board mask based on the default BOARD_MASK.
 * Holes (false) and playable cells (true) are shuffled, but the board remains roughly connected and playable.
 * Always ensures the center cell is playable.
 */
export function getRandomBoardMask() {
  // Helper: get all neighbors of a cell in the hex grid
  function getNeighbors(row, col, mask) {
    const even = row % 2 === 0;
    const directions = even
      ? [[-1, 0], [-1, -1], [0, -1], [1, 0], [1, -1], [0, 1]]
      : [[-1, 0], [-1, 1], [0, -1], [1, 0], [1, 1], [0, 1]];
    const neighbors = [];
    for (const [dr, dc] of directions) {
      const nr = row + dr, nc = col + dc;
      if (
        nr >= 0 && nr < mask.length &&
        nc >= 0 && nc < mask[0].length &&
        mask[nr][nc]
      ) {
        neighbors.push([nr, nc]);
      }
    }
    return neighbors;
  }

  // Helper: BFS to count connected playable cells
  function countConnected(mask, startRow, startCol) {
    const visited = Array.from({ length: mask.length }, () => Array(mask[0].length).fill(false));
    let count = 0;
    const queue = [[startRow, startCol]];
    visited[startRow][startCol] = true;
    while (queue.length) {
      const [row, col] = queue.shift();
      count++;
      for (const [nr, nc] of getNeighbors(row, col, mask)) {
        if (!visited[nr][nc]) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return count;
  }

  // Deep copy the default mask
  let mask = BOARD_MASK.map(row => [...row]);
  const center = [3, 3];

  // List of all playable cell positions except center
  const cells = [];
  for (let row = 0; row < mask.length; row++) {
    for (let col = 0; col < mask[row].length; col++) {
      if (mask[row][col] && !(row === center[0] && col === center[1])) {
        cells.push([row, col]);
      }
    }
  }

  // Shuffle the cells array
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  // Try to remove up to 25% of cells, but only if the board remains connected
  const maxHoles = Math.floor((cells.length + 1) / 4); // +1 for center
  let holes = 0;
  for (const [r, c] of cells) {
    if (holes >= maxHoles) break;
    // Tentatively remove
    mask[r][c] = false;
    // Check connectivity
    const total = mask.flat().filter(Boolean).length;
    const connected = countConnected(mask, center[0], center[1]);
    if (connected === total) {
      holes++;
    } else {
      // Undo removal if not connected
      mask[r][c] = true;
    }
  }
  return mask;
}


