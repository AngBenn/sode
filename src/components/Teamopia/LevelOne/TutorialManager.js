import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import TutorialPrompt from './TutorialPrompt';

const TutorialManager = ({
  playerPosition,
  amyPosition,
  tutorialStep,
  setTutorialStep,
  setHasLost,
  keyPosition,
  showWarning,
  setShowWarning,
  gameStarted,
  colorChallengeActive,


}) => {
  const timeoutRef = useRef(null);
  const prevDistanceRef = useRef(0);
  const [debugInfo, setDebugInfo] = useState({
    playerToAmy: 0,
    playerToDoor: 0,
    amyToDoor: 0,
  });



  // Helper function to check distance between two positions
  const checkDistance = (pos1, pos2) => {
    if (!pos1 || !pos2) return Infinity;
    return Math.sqrt(
      (pos1[0] - pos2[0]) ** 2 +
      (pos1[1] - pos2[1]) ** 2 +
      (pos1[2] - pos2[2]) ** 2
    );
  };

  useFrame(() => {
    if (!playerPosition || !amyPosition) return;
  
    const playerAmyDistance = checkDistance(playerPosition, amyPosition);
  
    // Tutorial Step 0: Approach Amy
    if (tutorialStep === 0) {
      if (playerAmyDistance < 3) {
        setTutorialStep(1);
      }
    }
  });

  // Call useEffect unconditionally
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // Empty dependency array to clean up the timeout on component unmount
  // Only show tutorial after the game has started

  if (!gameStarted) {
    return null; // Early exit if the game hasn't started
  }

  return (
    <>

      {/* Debug display - remove in production */}
      {/* Uncomment this to see debug info during development */}
      {/* 
      <Html position={[0, 5, 0]}>
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontFamily: 'monospace'
        }}>
          <p>Player to Amy: {debugInfo.playerToAmy}</p>
          <p>Player to Door: {debugInfo.playerToDoor}</p>
          <p>Amy to Door: {debugInfo.amyToDoor}</p>
          <p>Tutorial Step: {tutorialStep}</p>
          <p>Warning: {showWarning ? 'Yes' : 'No'}</p>
        </div>
      </Html>
      */}
    </>
  );
};

export default TutorialManager;
