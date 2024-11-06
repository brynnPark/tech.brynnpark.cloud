// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TechBlogPage from './components/TechBlogPage';
import TechBlogPost from './components/TechBlogPost';
import './App.css';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TechBlogPage />} />
        <Route path="/:slug" element={<TechBlogPost />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

