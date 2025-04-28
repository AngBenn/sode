// LoseScreen.jsx
import { useSound } from 'use-sound'
import { useEffect } from 'react';

export default function LoseScreen({ onRetry }) {
  const [playLost] = useSound('/sounds/voice/lost.mp3')

  useEffect(() => {
    playLost()
  }, [])

  return (
    <div className="lose-screen">
      <div className="lose-content">
        <div className="big-red-x">❌</div>
        <h2>Oh no! You wandered too far!</h2>
        <button className="retry-button" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  )
}