// Key.jsx
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState, useMemo } from 'react'
import { useSpring, animated } from '@react-spring/three'

const AnimatedKey = animated.group

export default function Key({ position }) {
  const { scene } = useGLTF('/models/key.glb')
  const [hovered, setHovered] = useState(false)
  const [collected, setCollected] = useState(false)

  const { scale, positionY } = useSpring({
    scale: collected ? 0 : hovered ? 1.2 : 1,
    positionY: collected ? -10 : position[1],
    config: { tension: 400, friction: 20 }
  })

  useFrame((state) => {
    scene.rotation.y += 0.02
    if (!collected) {
      scene.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })

  return (
    <AnimatedKey 
      position={[position[0], positionY, position[2]]}
      scale={scale}
      onPointerOver={() => !collected && setHovered(true)}
      onPointerOut={() => !collected && setHovered(false)}
    >
      <primitive object={scene} />
      <pointLight
        color="#ffd700"
        intensity={hovered ? 2 : 1}
        distance={5}
        decay={1.5}
      />
    </AnimatedKey>
  )
}