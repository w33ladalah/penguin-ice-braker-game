# Penguin Ice Breaker

A fun and challenging hexagonal puzzle game built with React and Canvas.

## Game Objective
Move the penguin around the ice, breaking each tile as you step on it. Try to break all the ice tiles without getting stuck!

## Features
- **Canvas-based hexagonal board rendering**
- **Score tracking**: Your score increases as you break more ice tiles
- **Pause and Restart**: Pause/resume or restart the game at any time
- **Win/Lose Messages**: Get notified when you win (all ice broken) or lose (no more moves)
- **Keyboard & Mouse Controls**: Move with arrow keys, WASD, Q/E, or by clicking

## Controls
- **Arrow keys / WASD / Q/E**: Move the penguin in 6 directions
- **Mouse Click**: Click a neighboring tile to move
- **Pause Button**: Pause or resume the game
- **Restart Button**: Start a new game

## Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open your browser to the local address shown in the terminal.

## Project Structure
- `src/HexBoardCanvas.jsx` - Main game logic and rendering
- `src/App.jsx` - UI, state management, and controls
- `src/boardShape.js` - Board mask and layout

## Credits
- Penguin emoji by [Twitter Emoji](https://emojipedia.org/penguin)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

---
Enjoy playing Penguin Ice Breaker!
