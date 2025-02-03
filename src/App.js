import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Progress from './pages/Progress';
import Register from './pages/Register';
import Reports from './pages/Reports';
import Scenario from './pages/Scenario';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/scenario" element={<Scenario />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;


