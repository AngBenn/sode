import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Progress from './pages/Progress&Tracking';
import Register from './pages/Register';

import Scenario from './pages/Scenario';
import ScenarioDetail from './components/ScenarioDetail'; 
import Levels from './components/LevelsPage';
import Profile from './components/Profile';
import LandingPage from './pages/LandingPage';
import LevelOne from './components/Teamopia/LevelOne/LevelOne';
import LevelTwo from './components/Teamopia/LevelTwo/LevelTwo';
import LevelThree from './components/Teamopia/LevelThree/LevelThree';
import './shader-chunks';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/progress&tracking" element={<Progress />} />
        <Route path="/scenario" element={<Scenario />} />
        <Route path="/levels/:scenarioName" element={<Levels />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Teamopia/LevelOne" element={<LevelOne />} />
        <Route path="/Teamopia/LevelTwo" element={<LevelTwo />} />
        <Route path="/Teamopia/LevelThree" element={<LevelThree />} />

        
        
        <Route path="/scenario/:scenarioName/level/:levelNumber/:levelName" element={<ScenarioDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
