// src/components/TechBlogPost.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Post1 from '../tech_posts/Post1';
import Post2 from '../tech_posts/Post2';
// Import more posts as needed...

const posts = [Post1, Post2]; // Combine all imported posts into an array

function TechBlogPost() {
  const { slug } = useParams(); // Get the slug from the URL
  const post = posts.find((post) => post.slug === slug); // Find the post by slug

  // If the post is not found, return a 404 message
  if (!post) {
    return <h1>404 - Post Not Found</h1>;
  }

  return (
    <div className="blog-post">
      {/* Link to go back to the blog page */}
      <div className="top-left-link">
        <Link to="/">← Back to Blog</Link> {/* Adjust the path as needed */}
      </div>

      <h1>{post.title}</h1>
      <p><small>{post.date}</small></p>
      <div className="post-content">{post.content}</div>
    </div>
  );
}

export default TechBlogPost;
