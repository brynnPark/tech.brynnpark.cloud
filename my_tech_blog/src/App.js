// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TechBlogPage from './components/TechBlogPage';
import TechBlogPost from './components/TechBlogPost';
import './App.css'; // Ensure styles are imported

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TechBlogPage />} />
          <Route path="/:slug" element={<TechBlogPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

