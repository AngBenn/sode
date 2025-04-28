// src/components/Teamopia/LevelOne/ParticleEffects.jsx
import { Stars } from '@react-three/drei'

export default function ParticleEffects() {
  return (
    <>
      <Stars
        position={[0, 2, 0]}
        count={50}
        speed={0.1}
        size={3}
        color="#ffd700"
        scale={10}
      />
      <Stars
        position={[3, 1, -5]}
        count={20}
        speed={0.2}
        size={2}
        color="#00ff00"
        scale={5}
      />
    </>
  )
}