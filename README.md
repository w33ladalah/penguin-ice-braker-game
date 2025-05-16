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
- **Sound Effects & Music**: Enjoy sound effects for breaking ice, winning, and losing, plus looping background music for a fun atmosphere
- **Mute/Unmute Controls**: Easily mute or unmute music and sound effects from the UI

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

### Adding Custom Sounds & Music
- Place your audio files in the `public/sounds` directory:
  - `ice_break.mp3`   – plays when the penguin moves/breaks ice
  - `win.mp3`         – plays when you win
  - `lose.mp3`        – plays when you lose or get stuck
  - `music.mp3`       – loops as background music during play
- Supported formats: `.mp3`, `.wav`, `.ogg` (update the code if you use a different extension)
- You can find free sounds at [Pixabay](https://pixabay.com/sound-effects/), [Freesound](https://freesound.org), or [Mixkit](https://mixkit.co/free-sound-effects/)

### Audio Controls
- Use the **Mute/Unmute Music** button to toggle background music
- Sound effects are automatically muted when music is muted

## Project Structure
- `src/HexBoardCanvas.jsx` - Main game logic, rendering, and sound effect triggers
- `src/App.jsx` - UI, state management, music controls, and mute/unmute logic
- `src/boardShape.js` - Board mask and layout
- `public/sounds/` - Place your sound and music files here

## Credits
- Penguin emoji by [Twitter Emoji](https://emojipedia.org/penguin)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

---
Enjoy playing Penguin Ice Breaker!
