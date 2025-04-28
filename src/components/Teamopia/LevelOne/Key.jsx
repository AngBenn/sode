import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Door({ position = [0, 2, 2], scale = [1, 1, 1], rotation = [0, 0, 0], }) {
  const { scene } = useGLTF('/models/key.glb')

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={scene} />
    </group>
  )
}
