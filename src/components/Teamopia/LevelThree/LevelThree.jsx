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
import Door from './TreasureChest';
import TutorialPrompt from './TutorialPrompt';
import LoseScreen from './LoseScreen';
import useSound from 'use-sound';
import * as THREE from 'three';
import Puzzleboard from './Puzzleboard';

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

  return <audio ref={bgMusicRef} src="/sounds/background1.mp3" preload="auto" />;
}

function ProgressTracker({ setProgress }) {
  const { progress } = useProgress();
  useEffect(() => setProgress(progress), [progress, setProgress]);
  return null;
}

export default function LevelOne() {
  const gameLogic = GameLogic();
  const [amyPosition, setAmyPosition] = useState([2, 1, -3]);
  const [doorPosition] = useState(new THREE.Vector3(2, 1, -10));
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
  const [puzzleDone, setPuzzleDone] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);

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
    setPuzzleDone(false);
    setShowPuzzle(false);
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
                doorPosition={doorPosition}
                amyAction={gameLogic.amyAction}
                onAmyActionChange={(action) => gameLogic.setAmyAction(action)}
                onLevelComplete={handleLevelComplete}
                showWarning={showWarning}
                setShowWarning={setShowWarning}
                puzzleDone={puzzleDone}
                setPuzzleDone={setPuzzleDone}
                chestOpened={chestOpened}
                setShowPuzzle={setShowPuzzle}
                showPuzzle={showPuzzle}
              />
            )}
            {gameStarted && showTutorial && (
              <TutorialManager
                playerPosition={gameLogic.avatarPosition}
                amyPosition={amyPosition}
                tutorialStep={tutorialStep}
                setTutorialStep={setTutorialStep}
                setHasLost={setHasLost}
                doorPosition={doorPosition}
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

        {gameStarted && showTutorial && !showPuzzle && (
          <div className="tutorial-overlay">
            <TutorialPrompt
              step={tutorialStep}
              showWarning={showWarning}
              playerPosition={gameLogic.avatarPosition}
              amyPosition={amyPosition}
              doorPosition={doorPosition}
              gameStarted={gameStarted}
            />
          </div>
        )}

        {showPuzzle && !puzzleDone && (
          <Puzzleboard
            onPuzzleComplete={() => {
              setPuzzleDone(true);
              setShowPuzzle(false);
            }}
          />
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
          <p>Puzzle Shown: {showPuzzle ? 'Yes' : 'No'}</p>
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
  doorPosition,
  onAmyActionChange,
  onLevelComplete,
  showWarning,
  setShowWarning,
  setShowPuzzle,
  puzzleDone,
  setPuzzleDone,
  amyAction,
  showPuzzle,
}) {
  const gameLogic = useGameLogic();
  const [keysPressed, setKeysPressed] = useState({ forward: false, backward: false, left: false, right: false });
  const cameraRef = useRef();
  const playerRef = useRef();
  const amyRef = useRef();
  const [amyIsWalking, setAmyIsWalking] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const frameCount = useRef(0);
  const [doorAction, setDoorAction] = useState(null);

  useFrame((_, delta) => {
    if (!playerRef.current || !amyRef.current || levelComplete) return;

    const playerPos = playerRef.current.position;
    const amyPos = amyRef.current.position;
    const distance = playerPos.distanceTo(amyPos);
    const distanceToDoor = amyPos.distanceTo(doorPosition);
    const playerDistanceToDoor = playerPos.distanceTo(doorPosition);

    // Show puzzle when both are near the door
    if (distanceToDoor < 2.5 && playerDistanceToDoor < 4 && !puzzleDone && !showPuzzle) {
      setShowPuzzle(true);
      setAmyIsWalking(false);
      onAmyActionChange('idle');
      return; // Stop further processing
    }

    // Start running when player gets close
    if (distance < 4 && !amyIsWalking && !showPuzzle) {
      setAmyIsWalking(true);
      onAmyActionChange('running');
    }

    if (amyIsWalking && !showPuzzle) {
      const targetPoint = new THREE.Vector3().copy(doorPosition);
      const direction = new THREE.Vector3().subVectors(targetPoint, amyPos).normalize();
      const speed = 0.75 * delta;

      amyRef.current.position.add(direction.multiplyScalar(speed));

      const angle = Math.atan2(
        doorPosition.x - amyRef.current.position.x,
        doorPosition.z - amyRef.current.position.z
      );

      amyRef.current.rotation.y = THREE.MathUtils.lerp(
        amyRef.current.rotation.y,
        angle,
        0.1
      );

      if (frameCount.current % 10 === 0) {
        setAmyPosition([
          amyRef.current.position.x,
          amyRef.current.position.y,
          amyRef.current.position.z
        ]);
      }
      frameCount.current++;

      if (distanceToDoor < 0.5) {
        setAmyIsWalking(false);
        onAmyActionChange('idle');
      }
    }

    if (amyIsWalking && puzzleDone) {
      const targetPoint = new THREE.Vector3().copy(doorPosition);
      const direction = new THREE.Vector3().subVectors(targetPoint, amyPos).normalize();
      const speed = 0.75 * delta;

      amyRef.current.position.add(direction.multiplyScalar(speed));

      const angle = Math.atan2(
        doorPosition.x - amyRef.current.position.x,
        doorPosition.z - amyRef.current.position.z
      );

      amyRef.current.rotation.y = THREE.MathUtils.lerp(
        amyRef.current.rotation.y,
        angle,
        0.1
      );

      if (distanceToDoor < 0.1) {
        setAmyIsWalking(false);
        onAmyActionChange('excited');
        setDoorAction('open');
        setTimeout(() => {
          setLevelComplete(true);
          onLevelComplete();
        }, 2000);
      }
    }
  });

  useEffect(() => {
    if (puzzleDone && !amyIsWalking) {
      setAmyIsWalking(true);
      onAmyActionChange('running');
    }
  }, [puzzleDone]);

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
        position={[-1, 1, -3]}
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
        updateGameLogicPosition={() => { }}
        onStartGame={() => { }}
        isLoading={isLoading}
        action={amyAction || 'idle'}
      />

      <Door
        position={doorPosition}
        scale={[0.04, 0.04, 0.04]}
        rotation={[0, 0, 0]}
        action={doorAction}
      >
        {!puzzleDone && (
          <Html distanceFactor={10}>
            <div className="door-prompt">
              {showPuzzle ? "Complete the puzzle!" : "Approach with Amy"}
            </div>
          </Html>
        )}
      </Door>

      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 4, 10]} fov={75} />
    </Physics>
  );
}