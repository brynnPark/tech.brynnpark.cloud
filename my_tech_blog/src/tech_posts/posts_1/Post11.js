import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'
import postContent from '../post_content/Post11.md';

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'Istio란?';

const Post11 = {
  id: 11,
  slug: SlugGenerator(title),
  title: title,
  date: 'Feb, 2025',
  tags: ['Istio', 'Kubernetes'],
  excerpt: '이 포스팅은 클라우드 컴퓨팅의 기초적인 요소와 AWS 서비스를 훑어본다. 특히, 서비스를 설계하기 위해 필요한 기초적인 서비스를..',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
  // content: <MarkdownViewer content={postContent} />,
  // content: <MDEditor.Markdown source={postContent} />,
};

export default Post11;
