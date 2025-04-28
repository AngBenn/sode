// StartScreen.js
import React from 'react';
import './startScreen.css';

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1 className="title">🌍 Welcome to Teamopia: Level One</h1>
      <button className="start-button" onClick={onStart}>Start Scenario</button>
    </div>
  );
}
