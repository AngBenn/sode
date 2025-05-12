import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

const ColorSquare = ({ position, color, size = 2, onClick, isCorrect }) => {
  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <CuboidCollider args={[size/2, 0.1, size/2]} />
      <mesh 
        position={[0, 0.1, -20]} 
        onClick={onClick}
        receiveShadow
      >
        <boxGeometry args={[2.5, 0.8, size]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.3}
          roughness={0.8}
        />
      </mesh>
    </RigidBody>
  );
};

export default ColorSquare;