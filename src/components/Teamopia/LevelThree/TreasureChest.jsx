import React, { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

export default function Door({ 
  position = [0, 2, 2], 
  scale = [1, 1, 1], 
  rotation = [0, 0, 0],
  action 
}) {
  const { scene, animations } = useGLTF('/models/treasure_chest.glb')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    if (action && actions[action]) {
      const animAction = actions[action]
      animAction.setLoop(THREE.LoopOnce, 1)
      animAction.clampWhenFinished = true
      animAction.reset().fadeIn(0.5).play()
    }
  }, [action, actions])

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={scene} />
    </group>
  )
}