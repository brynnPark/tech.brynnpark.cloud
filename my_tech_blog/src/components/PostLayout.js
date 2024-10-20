import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './PostLayout.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function PostLayout({ title, date, tags, headings, content }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const toc = document.querySelector('.toc-container');
      const scrollPosition = window.scrollY;
      
      // Adjust the position dynamically based on scroll
      if (scrollPosition > 200) {
        toc.style.top = scrollPosition + 'px';  // Move TOC down as you scroll
      } else {
        toc.style.top = '200px'; // Default starting position
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures the effect runs once



  return (
    <div className="post-layout">
      
      {/* Button to go back to the previous page */}
      <button className="go-back-button" onClick={() => navigate('/')}>
        <i className="fas fa-angle-double-left"></i> back
      </button>

      <div className="post-container">
        <h1 className="post-title">{title}</h1>
        <p className="post-date"><small>{date}</small></p>
        
        {/* Render tags with a unique class */}
        <div className="post-detail-tags">
          {tags && tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>

    {/* Sidebar for TOC */}
    <aside className="toc-container">
      <h3>Table of Contents</h3>
      <ul className="table-of-contents">
        {headings.map((heading) => (
          <li key={heading.id} className={`toc-level-${heading.level}`}>
            <a href={`#${heading.id}`} data-level={heading.level}>
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
</aside>

        <div className="post-content">{content}</div>
      </div>
    </div>
  );
}

export default PostLayout;
