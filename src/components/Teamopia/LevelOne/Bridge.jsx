// Bridge.jsx
import { useFrame } from '@react-three/fiber'
import { useState, useRef, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/three'

const AnimatedBridge = animated.mesh

export default function Bridge({ activated }) {
  const bridgeRef = useRef()
  const [targetY] = useState(0.3)

  const { bridgeHeight } = useSpring({
    bridgeHeight: activated ? -0.1 : 0.3,
    config: { mass: 1, tension: 180, friction: 20 }
  })

  return (
    <group position={[4.5, 0.2, -6.7]}>
      <AnimatedBridge castShadow receiveShadow position-y={bridgeHeight}>
        <boxGeometry args={[5, 0.3, 3]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.8}
          roughness={0.2}
          emissive="#ffd700"
          emissiveIntensity={0.3}
        />
      </AnimatedBridge>
      <mesh position={[-2.5, -0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1]} />
        <meshStandardMaterial color="#5d4037" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  )
}