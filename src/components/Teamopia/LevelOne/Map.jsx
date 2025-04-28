// MapComponent.jsx
import { useGLTF } from '@react-three/drei'

export function MapComponent() {
  const { scene } = useGLTF('/models/ancient_map.glb')
  
  return (
    <group position={[-3, 2.5, 0]} rotation={[0, Math.PI/4, 0]} scale={0.8}>
      <primitive object={scene} />
    </group>
  )
}