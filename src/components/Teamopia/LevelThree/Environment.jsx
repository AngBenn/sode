import { useGLTF } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Environment component for side-scrolling
// In Environment.jsx
function Environment({ playerPosition = [0, 0, 0] }) {
  const { scene } = useGLTF('/models/camping_buscraft_ambience.glb');

  return (
    <group position={[0, 0, 3]} scale={2} rotation={[0, Math.PI/1.2, 0]}>

      <primitive object={scene} />
    </group>
  );
}

export default function EnvironmentWrapper({ playerPosition }) {
  return (
    <Suspense fallback={
      <Text position={[0, 0, 0]} fontSize={1} color="white">
        Loading Environment...
      </Text>
    }>
      <Environment playerPosition={playerPosition} />
    </Suspense>
  );
}
useGLTF.preload('/models/game_pirate_adventure.glb');
