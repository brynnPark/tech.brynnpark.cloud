// src/components/TechBlogPage.js
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import posts from '../tech_posts';

function TechBlogPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [showAllTags, setShowAllTags] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const tagContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  // Get all unique tags and add "All" as the default option
  const allTags = useMemo(() => ['All', ...new Set(posts.flatMap(post => post.tags))], []);
  const filteredPosts = selectedTag === 'All' ? posts : posts.filter(post => post.tags.includes(selectedTag));
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag]);
  

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
      <div
          className="tag-filter-container"
          ref={tagContainerRef}
          style={{
            maxHeight: showAllTags
              ? tagContainerRef.current?.scrollHeight
              : '40px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}
        >
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
      {currentPosts.map(post => (
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
      {totalPages > 1 && (
        <div className="pagination-container">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
        ))}
      </div>
)}



    </div>
  );
}

export default TechBlogPage;
