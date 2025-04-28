import { Canvas, useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense, useState, useEffect, useRef } from 'react';
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
import AvatarDebug from './AvatarDebug';

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
      musicOn ? audio.play().catch(() => {}) : audio.pause();
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
  const [keyPosition] = useState(new THREE.Vector3(2,0,-30));

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [hasLost, setHasLost] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const [playApproach] = useSound('/sounds/approach-amy.mp3', { volume: soundOn ? 1 : 0 });
  const [playFindDoor] = useSound('/sounds/find-door.mp3', { volume: soundOn ? 1 : 0 });
  const [playStayClose] = useSound('/sounds/stay-close.mp3', { volume: soundOn ? 1 : 0 });
  const [playSuccess] = useSound('/sounds/victory.mp3', { volume: soundOn ? 1 : 0 });

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
    gameLogic.setAvatarPosition([-1, 1, -3]);
    setAmyPosition([2, 1, -3]);
    gameLogic.setAmyAction('idle');
  };

  const handleLevelComplete = () => {
    setLevelCompleted(true);
    gameLogic.setAmyAction('excited');
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
              />
            )}
            {gameStarted && showTutorial && (
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
              />
            )}
            {!isLoading && !gameStarted && (
              <Html center>
                <WelcomeScreen onStartGame={handleStartGame} />
              </Html>
            )}
          </Suspense>
        </Canvas>

        {gameStarted && showTutorial && (
          <div className="tutorial-overlay">
            <TutorialPrompt
              step={tutorialStep}
              showWarning={showWarning}
              playerPosition={gameLogic.avatarPosition}
              amyPosition={amyPosition}
              keyPosition={keyPosition}
              gameStarted={gameStarted}
            />
          </div>
        )}

        {levelCompleted && (
          <div className="level-complete-overlay">
            <div className="level-complete-modal">
              <h2>Level Complete!</h2>
              <div className="stars-container">
                <span className="star">⭐</span>
                <span className="star">⭐</span>
                <span className="star">⭐</span>
                <span className="star">⭐</span>
                <span className="star">⭐</span>
              </div>
              <p>You've successfully completed Level One!</p>
              <button onClick={() => console.log("Next Level")}>Next Level</button>
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
  amyAction,
}) {
  const gameLogic = useGameLogic();
  const [keysPressed, setKeysPressed] = useState({ forward: false, backward: false, left: false, right: false });
  const cameraRef = useRef();
  const playerRef = useRef();
  const amyRef = useRef();
  const [amyIsWalking, setAmyIsWalking] = useState(false);
  const [amyAtDoor, setAmyAtDoor] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const frameCount = useRef(0);

  useFrame((_, delta) => {
    if (!playerRef.current || !amyRef.current || levelComplete) return;
  
    const playerPos = playerRef.current.position;
    const amyPos = amyRef.current.position;
    const distance = playerPos.distanceTo(amyPos);
  
    // Start running when player gets close
    if (distance < 3 && !amyIsWalking) {
      setAmyIsWalking(true);
      if (amyAction !== 'running') {
        onAmyActionChange('running');
      }
    }
    
  
    if (amyIsWalking) {
      // Calculate direction to door using a predictive target point
      // This helps make the movement more smooth and natural
      const distanceToDoor = amyPos.distanceTo(keyPosition);
      
      
      // Calculate the target with some path smoothing
      const targetPoint = new THREE.Vector3().copy(keyPosition);
      
      // Get direction vector
      const direction = new THREE.Vector3().subVectors(targetPoint, amyPos).normalize();
      
      // Move at constant speed regardless of frame rate
      const speed = 0.75 * delta;
      
      // Apply movement directly to the ref without resetting
      amyRef.current.position.add(direction.multiplyScalar(speed));
      
      // Smooth rotation towards target
      const currentRotation = amyRef.current.rotation.clone();
      const targetRotation = new THREE.Euler();
      
      // Calculate angle to face door
      const angle = Math.atan2(
        keyPosition.x - amyRef.current.position.x,
        keyPosition.z - amyRef.current.position.z
      );
      
      // Set target rotation Y (keeping X and Z as they are)
      targetRotation.set(
        currentRotation.x,
        angle,
        currentRotation.z
      );
      
      // Smoothly interpolate rotation (slerp equivalent for Euler angles)
      amyRef.current.rotation.y = THREE.MathUtils.lerp(
        currentRotation.y,
        targetRotation.y,
        0.1
      );
      // Update state position every 10 frames to prevent stutter
    if (frameCount.current % 10 === 0) {
      setAmyPosition([
        amyRef.current.position.x,
        amyRef.current.position.y,
        amyRef.current.position.z
      ]);
    }
    frameCount.current++;

  
      // Check if we've reached the door
      if (distanceToDoor < 0.5) {
        setAmyIsWalking(false);
        onAmyActionChange('idle');
        setLevelComplete(true);
        onLevelComplete();
      }
      
      // Update state position to match ref position - only for UI/logic tracking
      // Do this infrequently to avoid performance impact
      setAmyPosition([
        amyRef.current.position.x,
        amyRef.current.position.y,
        amyRef.current.position.z
      ]);
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
        scale={[2, 2, 2]}
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
        updateGameLogicPosition={() => {}}
        onStartGame={() => {}}
        isLoading={isLoading}
        action={amyAction || 'idle'} 
      />

      <Key position={keyPosition} scale={[2, 2, 2]} rotation={[0, -Math.PI,0]}/>
      
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 4, 10]} fov={75} />
    </Physics>
  );
}