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
