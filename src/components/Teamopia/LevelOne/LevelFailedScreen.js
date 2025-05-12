export default function LevelFailedScreen({ onRetry }) {
    return (
      <div className="level-failed-overlay">
        <div className="level-failed-modal">
          <h2>Challenge Failed 😞</h2>
          <div className="warning-icon pulse">⚠️</div>
          <p>Don't worry! Try again...</p>
          <button className="retry-button" onClick={onRetry}>
            Retry Challenge
          </button>
        </div>
      </div>
    );
  }