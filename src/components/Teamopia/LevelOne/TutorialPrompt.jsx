import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';
import './TutorialPrompt.css';

const TutorialPrompt = ({ 
  step, 
  showWarning, 
  currentColor = '', 
  isPlayerTurn, 
  lives = 3
}) => {
  const [visible, setVisible] = useState(true);
  
  // Color mapping with proper styling
  const colors = {
    'RED': '#ff4444',
    'GREEN': '#44ff44',
    'BLUE': '#4444ff',
    'YELLOW': '#ffff44',
    'PURPLE': '#ff44ff'
  };

  // Added additional step states for debugging
  console.log(`Current tutorial step: ${step}`);
  console.log(`Current color: ${currentColor}`);
  console.log(`Is player turn: ${isPlayerTurn}`);

  const getStepContent = () => {
    switch(step) {
      case 0: 
        return { 
          title: "Go to Ama", 
          content: "Walk to Ama using the arrow keys", 
          emoji: "🚶" 
        };
      
      case 1: 
        return { 
          title: "Color Challenge!", 
          content: "Let's work together! Find the correct colors!", 
          emoji: "🎨" 
        };
      
      case 2: 
        return {
          title: "Your Turn!",
          content: `Move to the ${currentColor} square!`,
          emoji: "👟",
          color: colors[currentColor]
        };
      
      case 3: 
        return { 
          title: "Well Done!", 
          content: "Great job! Now watch Ama's turn", 
          emoji: "🎉" 
        };
      
      case 4: 
        return { 
          title: "Ama's Turn!", 
          content: `Amy needs to find the ${currentColor} square!`, 
          emoji: "👀",
          color: colors[currentColor]
        };
      
      case 5: 
        return { 
          title: "Nice!", 
          content: "Ama found her color!", 
          emoji: "👍" 
        };
      
      case 6: 
        return { 
          title: "Challenge Complete!", 
          content: "The key has appeared! You've won the round!", 
          emoji: "🗝️" 
        };
      
      case 7: 
        return { 
          title: "Wrong move!", 
          content: "Oops! Wrong color. Try again!", 
          emoji: "⚠️",
          color: colors[currentColor]
        };
      
      default: 
        return { 
          title: "Tutorial", 
          content: "Press arrow keys to move around", 
          emoji: "ℹ️" 
        };
    }
  };
  
  const content = getStepContent();

  return content ? (
    <div className="tutorial-overlay">
      <div className="instruction-card">
        <div className="speaker-icon">{content.emoji}</div>
        <h3>{content.title}</h3>
        <p>{content.content}</p>
        
        {content.color && (
          <div 
            className="color-preview" 
            style={{ backgroundColor: content.color }}
          />
        )}
        
        {lives > 0 && (
          <div className="lives-counter">
            Lives: {Array(lives).fill('❤️').join(' ')}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default TutorialPrompt;