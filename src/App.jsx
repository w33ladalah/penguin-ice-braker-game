import { useState } from 'react';
import './App.css';
import HexBoard from './HexBoard';

// Hex board dimensions (rows, cols)
const HEX_ROWS = 7;
const HEX_COLS = 7;
const START_POS = { x: 3, y: 3 };

// Helper: Only fill valid hexes for a hex board
function createHexGrid() {
  // Middle row is full, outer rows are shorter
  const mid = Math.floor(HEX_ROWS / 2);
  return Array.from({ length: HEX_ROWS }, (v, row) => {
    const minCol = Math.abs(mid - row);
    return Array.from({ length: HEX_COLS }, (v, col) =>
      col < minCol || col >= HEX_COLS - minCol ? null : 0
    );
  });
}

function App() {
  const [penguin, setPenguin] = useState(START_POS);
  const [grid, setGrid] = useState(createHexGrid());

  const movePenguin = (dx, dy) => {
    const newX = penguin.x + dx;
    const newY = penguin.y + dy;
    if (
      newX >= 0 && newX < HEX_COLS &&
      newY >= 0 && newY < HEX_ROWS &&
      grid[newY][newX] === 0
    ) {
      setPenguin({ x: newX, y: newY });
      setGrid(g => {
        const newGrid = g.map(row => [...row]);
        newGrid[newY][newX] = 1; // break ice
        return newGrid;
      });
    }
  };

  const handleKey = e => {
    if (e.key === 'ArrowUp') movePenguin(0, -1);
    if (e.key === 'ArrowDown') movePenguin(0, 1);
    if (e.key === 'ArrowLeft') movePenguin(-1, 0);
    if (e.key === 'ArrowRight') movePenguin(1, 0);
  };

  return (
    <div
      className="game-container"
      tabIndex={0}
      onKeyDown={handleKey}
      style={{ outline: 'none' }}
    >
      <h1>Penguin Ice Breaker</h1>
      <HexBoard grid={grid} penguin={penguin} />
      <p>Use arrow keys to move the penguin and break the ice!</p>
    </div>
  );
}

export default App;
