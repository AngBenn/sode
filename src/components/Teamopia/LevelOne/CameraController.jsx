import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const vec = new Vector3()

export default function CameraController({ isBridgeActivated }) {
  useFrame(({ camera }) => {
    // Different camera positions based on bridge state
    const targetPosition = isBridgeActivated 
      ? new Vector3(0, 8, 12) // Wide view
      : new Vector3(0, 5, 10) // Default view
    
    camera.position.lerp(targetPosition, 0.05)
    camera.lookAt(0, 0, 0)
  })
  
  return null
}