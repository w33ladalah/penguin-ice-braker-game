import { useState } from 'react';
import './App.css';
import HexBoard from './HexBoard';
import { BOARD_MASK } from './boardShape';

const HEX_ROWS = BOARD_MASK.length;
const HEX_COLS = BOARD_MASK[0].length;
const START_POS = { x: 3, y: 3 };

// Create a grid matching BOARD_MASK: 0 = ice, null = hole
function createHexGrid() {
  return BOARD_MASK.map(row => row.map(cell => (cell ? 0 : null)));
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
