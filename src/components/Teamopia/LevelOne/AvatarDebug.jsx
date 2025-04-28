import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';

const AvatarDebug = ({ roleName = 'Map Keeper' }) => {
  const modelPath = roleName === 'Map Keeper' ? '/models/map_keeper.glb' : '/models/keyholder.glb';

  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, scene);
  const groupRef = useRef();

  useEffect(() => {
    if (!animations || animations.length === 0) {
      console.warn(`🚫 No animations found in: ${modelPath}`);
    } else {
      console.log(`✅ Loaded model: ${modelPath}`);
      console.log('🎞️ Available animation clips:');
      animations.forEach((clip) => {
        console.log(`- ${clip.name}`);
      });

      console.log('💡 Actions object:', actions); // You’ll see what names `useAnimations` gives you access to
    }
  }, [animations, actions, modelPath]);

  return <primitive object={scene} ref={groupRef} />;
};

export default AvatarDebug;

