import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Post1 from '../tech_posts/Post1';
import Post2 from '../tech_posts/Post2';
// Import more posts as needed...

const posts = [Post1, Post2]; // Combine all imported posts into an array

function TechBlogPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [showAllTags, setShowAllTags] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false); // Track if tags overflow
  const tagContainerRef = useRef(null); // Reference to the tag container

  // Extract all unique tags from posts and include "All" as the first option
  const allTags = ['All', ...new Set(posts.flatMap((post) => post.tags))];

  // Filter posts by selected tag, showing all posts if "All" is selected
  const filteredPosts = selectedTag === 'All'
    ? posts
    : posts.filter((post) => post.tags.includes(selectedTag));

  // Toggle "Show More" functionality
  const toggleShowAllTags = () => {
    setShowAllTags(!showAllTags);
  };

  // Check if the tag container overflows
  useEffect(() => {
    if (tagContainerRef.current) {
      // Check if content overflows more than one line
      const isOverflown = tagContainerRef.current.scrollHeight > 40;
      setIsOverflowing(isOverflown);
    }
  }, [allTags]);

  return (
    <div className="blog-page">
      {/* Link to external webpage on the top right */}
      <div className="visit-web-page">
        <a href="https://brynnpark.cloud" target="_blank" rel="noopener noreferrer">
          Visit My Page
        </a>
      </div>

      {/* Blog title and image container */}
      <div className="blog-title-container">
        <img 
          src={`${process.env.PUBLIC_URL}/mimoji-laptop.png`}
          alt="Blog Logo" 
          className="blog-title-image"
        />
        <div className="speech-bubble">
          Welcome to <br />Brynn Park's Tech Blog &lt;3
        </div>
      </div>

      {/* Tag Filter Section */}
      <div 
        className={`tag-filter-container ${showAllTags ? 'expanded' : ''}`}
        ref={tagContainerRef} // Attach ref to the tag container
      >
        {allTags.map((tag, index) => (
          <button
            key={index}
            className={`tag-filter ${tag === 'All' ? 'all' : ''} ${selectedTag === tag ? 'selected' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Show "..." indicator when collapsed */}
      {isOverflowing && !showAllTags && (
        <div className="more-indicator">
          ...
        </div>
      )}

      {/* Show More Button - Correctly positioned above the posts */}
      {isOverflowing && (
        <div className="show-more-button-container"> {/* Wrapper for the button */}
          <button className="show-more-button" onClick={toggleShowAllTags}>
            {showAllTags ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}

      {/* Posts Container */}
      <div className="posts-container">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <h2>
              <Link to={`/${post.slug}`}>{post.title}</Link>
            </h2>
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
