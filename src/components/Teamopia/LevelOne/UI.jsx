import { Html } from '@react-three/drei'

export default function UI({ isStarted, startGame, selectedRole }) {
  if (isStarted) return (
    <Html center>
      <div className="role-badge">
        {selectedRole === 'Map Keeper' ? '🗺️ Map Keeper' : '🔑 Key Holder'}
      </div>
    </Html>
  )

  return (
    <Html center>
      <div className="role-select">
        <h2>Choose Your Role!</h2>
        <button onClick={() => startGame('Map Keeper')}>
          🗺️ Become Map Keeper
        </button>
        <button onClick={() => startGame('Key Holder')}>
          🔑 Become Key Holder
        </button>
      </div>
    </Html>
  )
}