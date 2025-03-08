import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import Logbook from './pages/Logbook';
import AddLog from './pages/AddLog';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/logbook">Logbook</Link></li>
            <li><Link to="/addlog">Add Entry</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logbook" element={<Logbook />} />
          <Route path="/addlog" element={<AddLog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
