// settingsmenu.js
import React from 'react';
import './SettingsMenu.css';

export default function SettingsMenu({
  musicOn,
  toggleMusic,
  soundOn,
  toggleSound,
  onPause,
  onQuit,
}) {
  return (
    <div className="settings-menu">
      <h2>⚙️Settings</h2>

      <div className="setting-item">
        <span><span className="emoji">🔊</span>Sound</span>
        <button 
          className="sound-button"
          onClick={toggleSound}
        >
          {soundOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <span><span className="emoji">🎵</span>Music</span>
        <button 
          className="music-button"
          onClick={toggleMusic}
        >
          {musicOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <span><span className="emoji">⏸️</span>Pause</span>
        <button 
          className="pause-button"
          onClick={onPause}
        >
          Click!
        </button>
      </div>

      <div className="setting-item">
        <span><span className="emoji">🚪</span>Exit</span>
        <button 
          className="quit-button"
          onClick={onQuit}
        >
          Bye Bye!
        </button>
      </div>
    </div>
  );
}