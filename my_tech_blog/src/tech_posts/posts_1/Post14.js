import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'
import postContent from '../post_content/Poast14.md';

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'MLOps란? ';

const Post14 = {
  id: 14,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['Observability', 'Logging', 'Monitoring', 'Tracing', 'DevOps'],
  excerpt: '이 포스팅은 Observability(가시성)의 개념과 구성요소, 그리고 Logging, Monitoring과의 차이점에 대해 다룬다. Netflix, Pinterest, 쿠팡 등 실제 기업의 사례를 통해 Observability가 어떻게 활용되는지를 소개하며, 분산 시스템과 클라우드 환경에서 왜 필수적인 개념인지 설명한다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
  // content: <MarkdownViewer content={postContent} />,
  // content: <MDEditor.Markdown source={postContent} />,
};

export default Post14;

