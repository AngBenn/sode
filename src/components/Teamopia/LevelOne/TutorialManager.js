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

  // Call useFrame unconditionally
  useFrame(() => {
    if (!playerPosition || !amyPosition || !keyPosition) return;

    const playerAmyDistance = checkDistance(playerPosition, amyPosition);
    const playerKeyDistance = checkDistance(playerPosition, keyPosition);
    const amyKeyDistance = checkDistance(amyPosition, keyPosition);

    // Update debug info
    setDebugInfo({
      playerToAmy: playerAmyDistance.toFixed(2),
      playerToKey: playerKeyDistance.toFixed(2),
      amyToKey: amyKeyDistance.toFixed(2)
    });

    // Tutorial Step 0: Approach Amy
    if (tutorialStep === 0) {
      if (playerAmyDistance < 3) {
        console.log('Tutorial Step 1 triggered: Player approached Amy');
        setTutorialStep(1);
        
      }
    }

    // Tutorial Step 1: Find the door together
    if (tutorialStep === 1) {
      prevDistanceRef.current = playerAmyDistance;

      if (playerAmyDistance > 5) {
        if (!showWarning) {
          console.log('Warning triggered: Player too far from Amy');
          setShowWarning(true);
          

          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            if (checkDistance(playerPosition, amyPosition) > 5) {
              console.log('Game over: Player stayed too far from Amy');
              setHasLost(true);
            }
          }, 3000);
        }
      } else {
        if (showWarning) {
          console.log('Warning cleared: Player returned to Amy');
          setShowWarning(false);
        }

       

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }

      // Level completion check: both near the door
      if (playerKeyDistance < 4 && amyKeyDistance < 4) {
        console.log('Level Complete! Both reached the door');
        setTutorialStep(2); // Move to next step if needed
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
