// src/components/PostLayout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostLayout.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function PostLayout({ title, date, tags, content }) {
  const navigate = useNavigate();

  return (
    <div className="post-layout">
      {/* Button to go back to the previous page */}
      <button className="go-back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-angle-double-left"></i> back
      </button>

      <h1 className="post-title">{title}</h1>
      <p className="post-date"><small>{date}</small></p>
      
      {/* Render tags with a unique class */}
      <div className="post-detail-tags">
        {tags && tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>

      <div className="post-content">{content}</div>
    </div>
  );
}

export default PostLayout;
