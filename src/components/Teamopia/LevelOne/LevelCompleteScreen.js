export default function LevelCompleteScreen({ onNext }) {
    return (
      <div className="level-complete-overlay">
        <div className="level-complete-modal">
          <h2>Level Complete! 🎉</h2>
          <div className="stars-container">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="star">⭐</span>
            ))}
          </div>
          <p>You mastered the color challenge!</p>
          <button onClick={onNext}>Next Level</button>
        </div>
      </div>
    );
  }