import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import Logbook from './pages/Logbook';
import AddLog from './pages/AddLog';

// Import components
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

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
