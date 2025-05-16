import { useState, useRef, useEffect } from 'react';
import './App.css';
import HexBoardCanvas from './HexBoardCanvas';

function App() {
  const [musicMuted, setMusicMuted] = useState(true);
  const musicRef = useRef(null);

  const [score, setScore] = useState(0); // penguin starts on 1 cell
  const [paused, setPaused] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [restartSignal, setRestartSignal] = useState(0);

  // Handler to increase score
  const handleScore = () => setScore(s => s + 1);
  // Handler to end game
  const handleGameEnd = (msg) => setGameMessage(msg);
  // Handler to pause
  // const handlePause = () => setPaused(p => !p);
  // Handler to restart
  const handleRestart = () => {
    setScore(0);
    setPaused(false);
    setGameMessage("");
    setRestartSignal(s => s + 1);
  };

  // Play/pause music on pause/game end
  useEffect(() => {
    if (!musicRef.current) return;
    if (paused || gameMessage) {
      musicRef.current.pause();
    } else if (!musicMuted) {
      musicRef.current.play().catch(()=>{});
    }
  }, [paused, gameMessage, musicMuted]);

  return (
    <>
    <div className="game-container" style={{ outline: 'none', position: 'relative' }}>
      <h1>Penguin Ice Breaker</h1>
      <div style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>Score: {score}</div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setMusicMuted(m => !m)} style={{ marginRight: 8 }}>
          {musicMuted ? 'Unmute Music' : 'Mute Music'}
        </button>
        {/* <button onClick={handlePause} style={{ marginRight: 8 }}>{paused ? 'Resume' : 'Pause'}</button> */}
        <button onClick={handleRestart}>Change Board</button>
      </div>
      <HexBoardCanvas
        score={score}
        onScore={handleScore}
        onGameEnd={handleGameEnd}
        paused={paused}
        restartSignal={restartSignal}
        musicMuted={musicMuted}
      />
      <p style={{ marginTop: 16 }}>Use arrow keys, WASD, Q/E or click to move the penguin and break the ice!</p>
      {gameMessage && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          zIndex: 10
        }}>
          <div>{gameMessage}</div>
          <button onClick={handleRestart} style={{ marginTop: 24, fontSize: 20 }}>Restart</button>
        </div>
      )}
      {/* Background music */}
      <audio ref={musicRef} src="/sounds/music.mp3" loop autoPlay preload="auto" volume={0.5} style={{ display: 'none' }} muted={musicMuted} />
    </div>
    <footer>
      <p>&copy; {new Date().getFullYear()} - Created by <a href="https://github.com/w33ladalah">Hendro Wibowo</a></p>
    </footer>
    </>
  );
}


export default App;
