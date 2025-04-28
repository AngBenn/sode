// src/components/TutorialPrompt.jsx
import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';
import './TutorialPrompt.css';

const TutorialPrompt = ({ step, showWarning, playerPosition, amyPosition, doorPosition, gameStarted }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ⛔️ Don't render if game hasn't started or positions are missing
  if (!gameStarted ) return null;

  const promptPosition = [playerPosition[0]+10, playerPosition[1] + 4, playerPosition[2]];

  return (
    <div className="instruction-card">
    {step === 0 && (
      <>
        <div className="speaker-icon">🎮</div>
        <h3>Welcome to the Adventure!</h3>
        <p>Use arrow keys to move to Amy</p>
      </>
    )}
    {step === 1 && (
      <>
        <div className="speaker-icon">🪙</div>
        
        <p> Work with Amy to solve the puzzle!
          The puzzle is key to get the final Teamopia Reward!
        </p>
      </>
    )}
    {step === 2 && (
      <>
        <div className="speaker-icon">🎉</div>
        <h3>Level Complete!</h3>
        <p>You made it to the treasure chest together!</p>
      </>
    )}
    {showWarning && (
      <div className="warning-alert pulse">
        <div className="warning-icon">⚠️</div>
        <p>Stay close to Amy!</p>
      </div>
    )}
  </div>
);
};

export default TutorialPrompt;
