// src/components/TechBlogPost.js
import React from 'react';
import { useParams } from 'react-router-dom';
import Post1 from '../tech_posts/Post1';
import Post2 from '../tech_posts/Post2';
import PostLayout from './PostLayout';

const posts = [Post1, Post2];

function TechBlogPost() {
  const { slug } = useParams();
  const post = posts.find((post) => post.slug === slug);

  // If the post is not found, return a 404 message
  if (!post) {
    return <h1>404 - Post Not Found</h1>;
  }

  return (
    <PostLayout 
      title={post.title}
      date={post.date}
      tags={post.tags} // Pass 'tags' prop here
      content={post.content}
    />
  );
}

export default TechBlogPost;
