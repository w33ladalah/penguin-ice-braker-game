// HexBoardCanvas.jsx
import React, { useRef, useEffect } from 'react';
import { BOARD_MASK } from './boardShape';

const HEX_SIZE = 32; // px, radius of hexagon
const HEX_GAP = 4; // px, space between hexes
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
const HEX_WIDTH = 2 * HEX_SIZE;
const HEX_HORIZ_SPACING = 1.5 * HEX_SIZE + HEX_GAP;
const HEX_VERT_SPACING = HEX_HEIGHT + HEX_GAP;

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

export default function HexBoardCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < BOARD_MASK.length; row++) {
      for (let col = 0; col < BOARD_MASK[row].length; col++) {
        if (!BOARD_MASK[row][col]) continue;
        const x = col * HEX_HORIZ_SPACING + (row % 2) * (HEX_HORIZ_SPACING / 2) + HEX_SIZE + 10;
        const y = row * (HEX_VERT_SPACING * 0.87) + HEX_SIZE + 10;
        drawHex(ctx, { x, y }, HEX_SIZE, '#e0f7fa', '#1976d2');
      }
    }
  }, []);

  // Canvas size based on board shape
  const width = BOARD_MASK[0].length * HEX_HORIZ_SPACING + HEX_SIZE * 2;
  const height = BOARD_MASK.length * HEX_VERT_SPACING * 0.87 + HEX_SIZE * 2;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ background: '#b3e5fc', borderRadius: 12, display: 'block', margin: '0 auto' }}
    />
  );
}
