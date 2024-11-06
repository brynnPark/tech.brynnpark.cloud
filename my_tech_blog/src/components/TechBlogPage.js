// src/components/TechBlogPage.js
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import posts from '../tech_posts';

function TechBlogPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [showAllTags, setShowAllTags] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const tagContainerRef = useRef(null);

  // Get all unique tags and add "All" as the default option
  const allTags = useMemo(() => ['All', ...new Set(posts.flatMap(post => post.tags))], []);
  const filteredPosts = selectedTag === 'All' ? posts : posts.filter(post => post.tags.includes(selectedTag));

  useEffect(() => {
    if (tagContainerRef.current) {
      setIsOverflowing(tagContainerRef.current.scrollHeight > 40); // Check if tags overflow
    }
  }, [allTags]);

  return (
    <div className="blog-page">
      <div className="visit-web-page">
        <a href="https://brynnpark.cloud" target="_blank" rel="noopener noreferrer">&nbsp; Visit My Page &nbsp;</a>
      </div>

      <div className="blog-title-container">
        <img src={`${process.env.PUBLIC_URL}/mimoji-laptop.png`} alt="Blog Logo" className="blog-title-image" />
        <div className="speech-bubble">
          Welcome to <br /> Brynn Park's Tech Blog &lt;3
        </div>
      </div>

      {/* Tag Filter Section */}
      <div className={`tag-filter-container ${showAllTags ? 'expanded' : ''}`} ref={tagContainerRef}>
        {allTags.map((tag, index) => (
          <button
            key={index}
            className={`tag-filter ${selectedTag === tag ? 'selected' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {isOverflowing && (
        <div className="show-more-button-container">
          <button className="show-more-button" onClick={() => setShowAllTags(!showAllTags)}>
            {showAllTags ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}

      <div className="posts-container">
        {filteredPosts.map(post => (
          <div key={post.id} className="post-card">
            <h2><Link to={`/${post.slug}`}>{post.title}</Link></h2>
            <p className="main-post-date"><small>{post.date}</small></p>
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            <p className="post-excerpt">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechBlogPage;
