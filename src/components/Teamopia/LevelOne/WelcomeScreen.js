import React, { useEffect, useState } from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onStartGame })  => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(
      'Welcome to Teamopia! Here, teamwork makes the dream work. Collaborate with your friends to achieve your goals!'
    );
  
    utterance.lang = 'en';
  
    const voices = speechSynthesis.getVoices();
    const africanVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.name.toLowerCase().includes('africa')
    );
  
    if (africanVoice) {
      utterance.voice = africanVoice;
    } else {
      console.log('No African accent found, using default voice');
    }
  
    speechSynthesis.speak(utterance);
  
    return () => {
      speechSynthesis.cancel(); // ✅ Stop speaking when component unmounts
    };
  }, []);
  




  
  const handleContinue = () => {
    setIsVisible(false);
    // Allow time for the animation to complete before calling onContinue
    setTimeout(() => {
        onStartGame();
    }, 500);
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className={`welcome-screen ${isVisible ? '' : 'fade-out'}`}>
      <div className="welcome-content">
        <div className="welcome-text">
          <h1>Welcome to Teamopia!</h1>
          <p>Here, teamwork makes the dream work. Collaborate with your friends to achieve your goals!</p>
          <button onClick={handleContinue}>Let's Start!</button>
        </div>
        <div className="welcome-image">
          <img src="/images/african_girl.png" alt="Child Illustration" className="child-image" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;