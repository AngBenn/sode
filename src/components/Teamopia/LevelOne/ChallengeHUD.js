// ChallengeHUD.js
import React, { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';

const ChallengeHUD = ({
  lives,
  message,
  currentRound,
  totalRounds,
  correctColor,
  playerTurn,
  coins,
  showKey
}) => {
  const [pulse, setPulse] = useState(false);
  const [shake, setShake] = useState(false);

  // Animation effects for feedback
  useEffect(() => {
    if (message.includes('Correct')) {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }
    if (message.includes('Wrong')) {
      setShake(true);
      setTimeout(() => setShake(false), 1000);
    }
  }, [message]);

  return (
    <group position={[0, 10, -20]}>
      {/* Round and Lives Display */}
      <Text
        fontSize={1}
        color="gold"
        position={[-8, 4, 0]}
        anchorX="left"
        anchorY="top"
      >
        Round: {currentRound}/{totalRounds}
      </Text>
      
      <Text
        fontSize={1}
        color="red"
        position={[8, 4, 0]}
        anchorX="right"
        anchorY="top"
      >
        Lives: ♥{lives}
      </Text>

      {/* Coins Display */}
      <Text
        fontSize={1}
        color="gold"
        position={[0, 4, 0]}
        anchorX="center"
        anchorY="top"
      >
        Coins: {coins}
      </Text>

      {/* Main Message */}
      <Text
        fontSize={1.5}
        color={playerTurn ? "yellow" : "cyan"}
        position={[0, 2, 0]}
        anchorX="center"
        anchorY="top"
        outlineWidth={0.1}
        outlineColor="black"
        {...(pulse && { scale: [1.2, 1.2, 1.2] })}
        {...(shake && { position: [Math.sin(Date.now()*0.1)*0.3, 2, 0] })}
      >
        {message}
      </Text>

      {/* Amy's Instruction */}
      {!playerTurn && (
        <Text
          fontSize={1}
          color="cyan"
          position={[0, 0, 0]}
          anchorX="center"
          anchorY="top"
        >
          {`Cooperate with Amy! She's looking for: ${correctColor}`}
        </Text>
      )}

      {/* Victory Key Display */}
      {showKey && (
        <Text
          fontSize={2}
          color="gold"
          position={[0, -2, 0]}
          anchorX="center"
          anchorY="top"
        >
          ✨ Key Appeared! ✨
        </Text>
      )}
    </group>
  );
};

export default ChallengeHUD;