import { Canvas, useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Text, PerspectiveCamera, useProgress, Html } from '@react-three/drei';
import Environment from './Environment';
import Avatar from './Avatar';
import useGameLogic from './useGameLogic';
import './styles.css';
import LoadingScreen from './LoadingScreen';
import SettingsMenu from './SettingsMenu';
import WelcomeScreen from './WelcomeScreen';
import TutorialManager from './TutorialManager';
import GameLogic from './GameLogic';
import Key from './Key';
import TutorialPrompt from './TutorialPrompt';
import LoseScreen from './LoseScreen';
import useSound from 'use-sound';
import * as THREE from 'three';
import ColorChallengeManager from './ColorChallengeManager';
import { useNavigate } from 'react-router-dom';



const keyMap = {
  forward: 'ArrowUp',
  backward: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
};


function AudioManager({ musicOn }) {
  const bgMusicRef = useRef();

  useEffect(() => {
    const audio = bgMusicRef.current;
    if (audio) {
      audio.volume = 0.3;
      audio.loop = true;
      musicOn ? audio.play().catch(() => { }) : audio.pause();
    }
  }, [musicOn]);

  return <audio ref={bgMusicRef} src="/sounds/background.mp3" preload="auto" />;
}

function ProgressTracker({ setProgress }) {
  const { progress } = useProgress();
  useEffect(() => setProgress(progress), [progress, setProgress]);
  return null;
}

export default function LevelOne() {
  const gameLogic = GameLogic();
  const [amyPosition, setAmyPosition] = useState([2, 0, -3]);
  const [keyPosition, setKeyPosition] = useState(new THREE.Vector3(100, 0, 100));
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(() => {
    const saved = localStorage.getItem('tutorialStep');
    return saved !== null ? parseInt(saved) : 0;
  });
  const [hasLost, setHasLost] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [colorChallengeActive, setColorChallengeActive] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [currentColor, setCurrentColor] = useState('');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [lives, setLives] = useState(3);
  const navigate = useNavigate();
  
  // Sound effects
  const [playApproach] = useSound('/sounds/approach-amy.mp3', { volume: soundOn ? 1 : 0 });
  const [playFindDoor] = useSound('/sounds/find-door.mp3', { volume: soundOn ? 1 : 0 });
  const [playStayClose] = useSound('/sounds/stay-close.mp3', { volume: soundOn ? 1 : 0 });
  const [playSuccess] = useSound('/sounds/victory.mp3', { volume: soundOn ? 1 : 0 });
  const [playCollision] = useSound('/sounds/lose.mp3', { volume: soundOn ? 0.5 : 0 });

  const intervalRef = useRef(null);

  const playTutorialAudio = (step) => {
    if (!soundOn) return;
    if (step === 0) playApproach();
    else if (step === 1) playFindDoor();
  };

  useEffect(() => {
    if (!showTutorial || !soundOn) return;
    const delayTimeout = setTimeout(() => {
      playTutorialAudio(tutorialStep);
      intervalRef.current = setInterval(() => {
        playTutorialAudio(tutorialStep);
      }, 50000);
    }, 500);
    return () => {
      clearTimeout(delayTimeout);
      clearInterval(intervalRef.current);
    };
  }, [tutorialStep, showTutorial, soundOn]);
  
  useEffect(() => {
    localStorage.setItem('tutorialStep', tutorialStep);
  }, [tutorialStep]);

  useEffect(() => {
    if (showWarning && soundOn) playStayClose();
  }, [showWarning, soundOn, playStayClose]);

  useEffect(() => {
    if (levelCompleted && soundOn) playSuccess();
  }, [levelCompleted, soundOn, playSuccess]);

  const handleStartGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      setShowTutorial(true);
      setTutorialStep(0);
    }, 2000);
  };
  

  const handleRestart = () => {
    setGameStarted(false);
    setHasLost(false);
    setTutorialStep(0);
    setIsLoading(true);
    setMinDelayPassed(false);
    setLoadingProgress(0);
    setLevelCompleted(false);
    setColorChallengeActive(false);
    setChallengeCompleted(false);
    setLives(3);
    gameLogic.setAvatarPosition([-1, 1, -3]);
    setAmyPosition([2, 1, -3]);
    gameLogic.setAmyAction('idle');
  };

  const handleLevelComplete = () => {
    setLevelCompleted(true);
    setColorChallengeActive(true);
    gameLogic.setAmyAction('idle'); // Set Amy to idle before starting the challenge
    if (soundOn) playSuccess();
  };

  const toggleMusic = () => setMusicOn(!musicOn);
  const toggleSound = () => setSoundOn(!soundOn);
  const handlePause = () => console.log("Game Paused");
  const handleQuit = () => console.log("Game Quit");
  const toggleSettingsMenu = () => setIsMenuVisible((prev) => !prev);

  useEffect(() => {
    const timer = setTimeout(() => setMinDelayPassed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minDelayPassed && loadingProgress >= 100) {
      setIsLoading(false);
    }
  }, [minDelayPassed, loadingProgress]);

  return (
    <div className="game-container">
      {hasLost && <LoseScreen onRetry={handleRestart} />}
      <AudioManager musicOn={musicOn} />
      {isLoading && <LoadingScreen progress={loadingProgress} />}
      <div className="game-container">
        <Canvas camera={{ position: [0, 4, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <ProgressTracker setProgress={setLoadingProgress} />

            {gameStarted && (
              <LevelOneLogic
                onStartGame={handleStartGame}
                isLoading={isLoading}
                setPlayerPos={gameLogic.setAvatarPosition}
                playerPosition={gameLogic.avatarPosition}
                amyPosition={amyPosition}
                setAmyPosition={setAmyPosition}
                keyPosition={keyPosition}
                amyAction={gameLogic.amyAction}
                onAmyActionChange={(action) => gameLogic.setAmyAction(action)}
                onLevelComplete={handleLevelComplete}
                showWarning={showWarning}
                setShowWarning={setShowWarning}
                challengeCompleted={challengeCompleted}
                colorChallengeActive={colorChallengeActive}
              />
            )}
            
            {gameStarted && showTutorial && !colorChallengeActive && (
              <TutorialManager
                playerPosition={gameLogic.avatarPosition}
                amyPosition={amyPosition}
                tutorialStep={tutorialStep}
                setTutorialStep={setTutorialStep}
                setHasLost={setHasLost}
                keyPosition={keyPosition}
                showWarning={showWarning}
                setShowWarning={setShowWarning}
                gameStarted={gameStarted}
                colorChallengeActive={colorChallengeActive}
              />
            )}
            
            {!isLoading && !gameStarted && (
              <Html center>
                <WelcomeScreen onStartGame={handleStartGame} />
              </Html>
            )}
            
            {colorChallengeActive && !challengeCompleted && (
              <ColorChallengeManager
                playerPosition={gameLogic.avatarPosition}
                amyPosition={amyPosition}
                setAmyPosition={setAmyPosition}
                onFail={() => {
                  setHasLost(true);
                  setLives(0);
                }}
                setTutorialStep={setTutorialStep}
                setCurrentColor={setCurrentColor}
                setIsPlayerTurn={setIsPlayerTurn}
                lives={lives}
                setLives={setLives}
                onComplete={() => {
                  setChallengeCompleted(true);
                  setKeyPosition(new THREE.Vector3(2, 0, -30));
                  if(soundOn) playSuccess();
                }}
                soundOn={soundOn}
              />
            )}
          </Suspense>
        </Canvas>

        {gameStarted && showTutorial && (
          <TutorialPrompt
            step={tutorialStep}
            showWarning={showWarning}
            currentColor={currentColor}
            isPlayerTurn={isPlayerTurn}
            lives={lives}
          />
        )}

{challengeCompleted && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full animate-fade-in">
      <h2 className="text-3xl font-bold mb-4 text-green-600">🎉 Level Complete!</h2>

      <div className="flex justify-center gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-4xl animate-pulse">⭐</span>
        ))}
      </div>

      <p className="text-lg text-gray-700 mb-6">You've successfully completed the challenge!</p>

      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
)}

      </div>

      {isMenuVisible && (
        <SettingsMenu
          musicOn={musicOn}
          toggleMusic={toggleMusic}
          soundOn={soundOn}
          toggleSound={toggleSound}
          onPause={handlePause}
          onQuit={handleQuit}
        />
      )}

      <button className="settings-button" onClick={toggleSettingsMenu}>
        ⚙️ Settings
      </button>

      {gameStarted && process.env.NODE_ENV === 'development' && (
        <div className="debug-panel">
          <p>Tutorial Step: {tutorialStep}</p>
          <p>Player: {JSON.stringify(gameLogic.avatarPosition)}</p>
          <p>Amy: {JSON.stringify(amyPosition)}</p>
          <p>Amy Action: {gameLogic.amyAction || 'walking'}</p>
          <p>Warning: {showWarning ? 'Yes' : 'No'}</p>
          <p>Level Complete: {levelCompleted ? 'Yes' : 'No'}</p>
          <p>Current Color: {currentColor}</p>
          <p>Lives: {lives}</p>
          <p>Player Turn: {isPlayerTurn ? 'Yes' : 'No'}</p>
          <p>Color Challenge Active: {colorChallengeActive ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}

function LevelOneLogic({
  onStartGame,
  isLoading,
  setPlayerPos,
  playerPosition,
  amyPosition,
  setAmyPosition,
  keyPosition,
  onAmyActionChange,
  onLevelComplete,
  showWarning,
  setShowWarning,
  challengeCompleted
}) {
  const gameLogic = useGameLogic();
  const [keysPressed, setKeysPressed] = useState({ forward: false, backward: false, left: false, right: false });
  const cameraRef = useRef();
  const playerRef = useRef();
  const amyRef = useRef();
  const [amyIsWalking, setAmyIsWalking] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const frameCount = useRef(0);

  useFrame((_, delta) => {
    if (!playerRef.current || !amyRef.current || levelComplete || challengeCompleted) return;

    const playerPos = playerRef.current.position;
    const amyPos = amyRef.current.position;
    const distanceToPlayer = playerPos.distanceTo(amyPos);

    if (distanceToPlayer < 3 && !amyIsWalking) {
      setAmyIsWalking(true);
      onAmyActionChange('talking');
      setTimeout(() => {
        onLevelComplete();
        // Reset Amy's state after completing level
        setAmyIsWalking(false);
      }, 2000);
    }
  });

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (Object.values(keyMap).includes(e.key)) {
        e.preventDefault();
        const direction = Object.keys(keyMap).find(k => keyMap[k] === e.key);
        setKeysPressed(prev => ({ ...prev, [direction]: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (Object.values(keyMap).includes(e.key)) {
        e.preventDefault();
        const direction = Object.keys(keyMap).find(k => keyMap[k] === e.key);
        setKeysPressed(prev => ({ ...prev, [direction]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Physics gravity={[0, -9.8, 0]} timeStep="1/60">
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <Environment />

      <Avatar
        ref={playerRef}
        roleName={gameLogic.selectedRole || "Player"}
        position={[-1, 0, -3]}
        scale={[2.5, 2.5, 2.5]}
        isPlayerControlled={true}
        isSpecialAction={gameLogic.isSpecialAction}
        movement={keysPressed}
        cameraRef={cameraRef}
        updateGameLogicPosition={setPlayerPos}
        onStartGame={onStartGame}
        isLoading={isLoading}
      />

      <Avatar
        ref={amyRef}
        roleName="Amy"
        position={amyPosition}
        scale={[2.5, 2.5, 2.5]}
        isPlayerControlled={false}
        isSpecialAction={false}
        movement={{}}
        cameraRef={null}
        updateGameLogicPosition={() => { }}
        onStartGame={() => { }}
        isLoading={isLoading}
        action={gameLogic.amyAction || 'idle'}
      />

      {challengeCompleted && (
        <Key position={keyPosition} scale={[2, 2, 2]} rotation={[0, -Math.PI, 0]} />
      )}

      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 4, 10]} fov={75} />
    </Physics>
  );
}