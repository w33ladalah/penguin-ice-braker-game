// HexBoard.jsx
import React from 'react';

export default function HexBoard({ grid, penguin }) {
  return (
    <div className="grid">
      {grid.map((row, y) => (
        <div
          className="row"
          key={y}
          style={{ marginLeft: `${Math.abs(Math.floor(grid.length / 2) - y) * 24}px` }}
        >
          {row.map((cell, x) =>
            cell === null ? (
              <div className="cell empty" key={x}></div>
            ) : (
              <div
                className={
                  'cell hex ' +
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
            )
          )}
        </div>
      ))}
    </div>
  );
}
