import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BOARD_MASK } from './boardShape';

const HEX_SIZE = 32;
const HEX_GAP = 6;
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
const HEX_WIDTH = 2 * HEX_SIZE;
const HEX_HORIZ_SPACING = 1.5 * HEX_SIZE + HEX_GAP;
const HEX_VERT_SPACING = HEX_HEIGHT + 1.5;
const PENGUIN_COLOR = '#1976d2';
const ICE_COLOR = '#e0f7fa';
const BROKEN_COLOR = '#d1d1d1';

function hexCorner(center, size, i) {
  const angle_deg = 60 * i - 30;
  const angle_rad = Math.PI / 180 * angle_deg;
  return {
    x: center.x + size * Math.cos(angle_rad),
    y: center.y + size * Math.sin(angle_rad),
  };
}

function drawHex(ctx, center, size, fillStyle, strokeStyle) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const { x, y } = hexCorner(center, size, i);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function getHexCenter(row, col) {
  const x = col * HEX_HORIZ_SPACING + (row % 2) * (HEX_HORIZ_SPACING / 2) + HEX_SIZE + 10;
  const y = row * (HEX_VERT_SPACING * 0.87) + HEX_SIZE + 10;
  return { x, y };
}

function getHexAtPos(x, y) {
  // Brute force: check all centers, return closest if within HEX_SIZE
  let minDist = HEX_SIZE;
  let found = null;
  for (let row = 0; row < BOARD_MASK.length; row++) {
    for (let col = 0; col < BOARD_MASK[row].length; col++) {
      if (!BOARD_MASK[row][col]) continue;
      const center = getHexCenter(row, col);
      const dx = x - center.x;
      const dy = y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        found = { row, col };
      }
    }
  }
  return found;
}

// Directions for 6-way movement: [dx, dy] (even/odd row offset)
const HEX_DIRS = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1],
  [1, -1], [-1, -1], // for even rows
  [1, 1], [-1, 1],   // for odd rows
];

export default function HexBoardCanvas({
  onScore,
  onGameEnd,
  paused,
  restartSignal
}) {
  // 0: ice, 1: broken
  const [grid, setGrid] = useState(() =>
    BOARD_MASK.map(row => row.map(cell => (cell ? 0 : null)))
  );
  const [penguin, setPenguin] = useState({ row: 3, col: 3 });
  const [gameEnded, setGameEnded] = useState(false);
  const [lastRestart, setLastRestart] = useState(restartSignal);

  // Reset on restart
  useEffect(() => {
    if (restartSignal !== lastRestart) {
      setGrid(BOARD_MASK.map(row => row.map(cell => (cell ? 0 : null))));
      setPenguin({ row: 3, col: 3 });
      setGameEnded(false);
      setLastRestart(restartSignal);
    }
  }, [restartSignal, lastRestart]);

  // Helper: get possible moves
  function getPossibleMoves(penguin, grid) {
    const even = penguin.row % 2 === 0;
    let dirs = [
      [1, 0], [-1, 0],
      [0, 1], [0, -1],
      even ? [1, -1] : [1, 1],
      even ? [-1, -1] : [-1, 1],
    ];
    return dirs
      .map(([dx, dy]) => {
        const row = penguin.row + dy;
        const col = penguin.col + dx;
        if (
          row >= 0 && row < BOARD_MASK.length &&
          col >= 0 && col < BOARD_MASK[0].length &&
          BOARD_MASK[row][col] &&
          grid[row][col] === 0
        ) {
          return { row, col };
        }
        return null;
      })
      .filter(Boolean);
  }

  // Check for stuck/lose/win after every move
  useEffect(() => {
    if (gameEnded) return;
    // Win: all ice broken except penguin's cell
    const totalIce = BOARD_MASK.flat().filter(Boolean).length;
    const broken = grid.flat().filter(x => x === 1).length;
    if (broken === totalIce) {
      setGameEnded(true);
      onGameEnd && onGameEnd('You win! 🎉');
      return;
    }
    // Lose: no moves
    if (getPossibleMoves(penguin, grid).length === 0) {
      setGameEnded(true);
      onGameEnd && onGameEnd('No more moves! You are stuck!');
      return;
    }
  }, [grid, penguin, gameEnded, onGameEnd]);

  // Draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw cells
    for (let row = 0; row < BOARD_MASK.length; row++) {
      for (let col = 0; col < BOARD_MASK[row].length; col++) {
        if (!BOARD_MASK[row][col]) continue;
        const center = getHexCenter(row, col);
        let color = ICE_COLOR;
        if (grid[row][col] === 1) color = BROKEN_COLOR;
        drawHex(ctx, center, HEX_SIZE, color, '#1976d2');
        // Draw penguin
        if (penguin.row === row && penguin.col === col) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(center.x, center.y, HEX_SIZE * 0.5, 0, 2 * Math.PI);
          ctx.fillStyle = PENGUIN_COLOR;
          ctx.fill();
          ctx.font = `${HEX_SIZE * 0.7}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#fff';
          ctx.fillText('🐧', center.x, center.y + 2);
          ctx.restore();
        }
      }
    }
    // Draw overlay for pause/game end
    if (paused || gameEnded) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = `${HEX_SIZE * 1.2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        paused ? 'Paused' : gameEnded ? 'Game Over' : '',
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.restore();
    }
  }, [grid, penguin, paused, gameEnded]);

  // Movement logic (6 directions)
  const movePenguin = useCallback((dirIdx) => {
    if (paused || gameEnded) return;
    const even = penguin.row % 2 === 0;
    let dirs = [
      [1, 0], [-1, 0],
      [0, 1], [0, -1],
      even ? [1, -1] : [1, 1],
      even ? [-1, -1] : [-1, 1],
    ];
    const [dx, dy] = dirs[dirIdx];
    const newRow = penguin.row + dy;
    const newCol = penguin.col + dx;
    if (
      newRow >= 0 && newRow < BOARD_MASK.length &&
      newCol >= 0 && newCol < BOARD_MASK[0].length &&
      BOARD_MASK[newRow][newCol] &&
      grid[newRow][newCol] === 0
    ) {
      setPenguin({ row: newRow, col: newCol });
      setGrid(g => {
        const newGrid = g.map(row => [...row]);
        newGrid[newRow][newCol] = 1; // break ice
        return newGrid;
      });
      onScore && onScore();
    }
  }, [penguin, grid, paused, gameEnded, onScore]);

  // Keyboard controls
  useEffect(() => {
    if (paused || gameEnded) return;
    const keyHandler = (e) => {
      if (paused || gameEnded) return;
      if (e.key === 'ArrowRight' || e.key === 'd') movePenguin(0);
      if (e.key === 'ArrowLeft' || e.key === 'a') movePenguin(1);
      if (e.key === 'ArrowDown' || e.key === 's') movePenguin(2);
      if (e.key === 'ArrowUp' || e.key === 'w') movePenguin(3);
      if (e.key === 'e') movePenguin(4);
      if (e.key === 'q') movePenguin(5);
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [movePenguin, paused, gameEnded]);

  // Mouse click to break ice or move penguin
  const canvasRef = useRef(null);
  const handleCanvasClick = (e) => {
    if (paused || gameEnded) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hex = getHexAtPos(x, y);
    if (!hex) return;
    // Move penguin if valid
    const { row, col } = hex;
    if (
      BOARD_MASK[row][col] &&
      grid[row][col] === 0 &&
      (Math.abs(row - penguin.row) <= 1 && Math.abs(col - penguin.col) <= 1)
    ) {
      setPenguin({ row, col });
      setGrid(g => {
        const newGrid = g.map(row => [...row]);
        newGrid[row][col] = 1;
        return newGrid;
      });
      onScore && onScore();
    }
  };

  // Canvas size based on board shape
  const width = BOARD_MASK[0].length * HEX_HORIZ_SPACING + HEX_SIZE * 2;
  const height = BOARD_MASK.length * HEX_VERT_SPACING * 0.87 + HEX_SIZE * 2;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ background: '#b3e5fc', borderRadius: 12, display: 'block', margin: '0 auto', cursor: paused || gameEnded ? 'not-allowed' : 'pointer' }}
      onClick={handleCanvasClick}
      tabIndex={0}
    />
  );
}
