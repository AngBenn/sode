// src/components/LevelComplete.jsx
import './TutorialPrompt.css';

export const LevelComplete = () => (
  <div className="level-complete-overlay">
    <div className="instruction-card success">
      <div className="speaker-icon">🎉</div>
      <h2>Level Complete!</h2>
      <div className="stars-container">
        <span className="star">⭐</span>
        <span className="star">⭐</span>
        <span className="star">⭐</span>
      </div>
      <p>Great teamwork! You found all the correct squares!</p>
    </div>
  </div>
);

// src/components/LevelFailed.jsx
import './TutorialPrompt.css';

export const LevelFailed = ({ onRetry }) => (
  <div className="level-complete-overlay">
    <div className="instruction-card warning">
      <div className="speaker-icon">😞</div>
      <h2>Try Again!</h2>
      <p>Don't worry, you'll get it next time!</p>
      <button onClick={onRetry}>Retry Challenge</button>
    </div>
  </div>
);