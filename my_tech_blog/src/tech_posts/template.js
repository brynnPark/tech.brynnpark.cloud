// src/tech_posts/Post2.js
import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from './utils/MarkdownRenderer';
import SlugGenerator from './utils/SlugGenerator';
import HeadingExtractor from './utils/HeadingExtractor';
import './post.css'

const imgUrl = `${process.env.REACT_APP_S3_IMG_URL}/post`;

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = '';

const postContent = `

`;


const Post = {
  id: 0,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['AWS', 'Technical Essentials'],
  excerpt: '이 포스팅은 클라우드 컴퓨팅의 기초적인 요소와 AWS 서비스를 훑어본다. 특히, 서비스를 설계하기 위해 필요한 기초적인 서비스를..',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post;

