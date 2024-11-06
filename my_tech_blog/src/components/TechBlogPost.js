// src/components/TechBlogPost.js
import React from 'react';
import { useParams } from 'react-router-dom';
import posts from '../tech_posts';
import PostLayout from './PostLayout';

function TechBlogPost() {
  const { slug } = useParams();
  const post = posts.find(post => post.slug === slug);

  if (!post) {
    return <h1>404 - Post Not Found</h1>;
  }

  return (
    <PostLayout 
      title={post.title}
      date={post.date}
      tags={post.tags}
      headings={post.headings || []}
      content={post.content}
    />
  );
}

export default TechBlogPost;
