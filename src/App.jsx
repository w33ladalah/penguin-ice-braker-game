import { useState } from 'react';
import './App.css';

const GRID_SIZE = 7;
const START_POS = { x: 3, y: 6 };

function createInitialGrid() {
  // 0: ice, 1: broken
  return Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => 0)
  );
}

function App() {
  const [penguin, setPenguin] = useState(START_POS);
  const [grid, setGrid] = useState(createInitialGrid());

  const movePenguin = (dx, dy) => {
    const newX = penguin.x + dx;
    const newY = penguin.y + dy;
    if (
      newX >= 0 && newX < GRID_SIZE &&
      newY >= 0 && newY < GRID_SIZE &&
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
      <div className="grid">
        {grid.map((row, y) => (
          <div className="row" key={y}>
            {row.map((cell, x) => (
              <div
                className={
                  'cell ' +
                  (penguin.x === x && penguin.y === y
                    ? 'penguin'
                    : cell === 1
                    ? 'broken'
                    : 'ice')
                }
                key={x}
              >
                {penguin.x === x && penguin.y === y ? '🐧' : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p>Use arrow keys to move the penguin and break the ice!</p>
    </div>
  );
}

export default App;
