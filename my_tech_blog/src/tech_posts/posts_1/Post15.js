import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'
import postContent from '../post_content/Post15.md';

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'Observability (2)';

const Post15 = {
  id: 15,
  slug: SlugGenerator(title),
  title: title,
  date: 'March, 2025',
  tags: ['Observability', 'Logging', 'Monitoring', 'Tracing', 'Grafana'],
  excerpt: '이 글에선 Observability 개념을 정리하고, Metrics, Logs, Traces 세 가지 카테고리 별 대표적인 오픈소스 툴들을 소개한다. 또한 Netflix와 Pinterest의 사례를 통해 기업들이 Observability를 어떻게 구축하고 있는지 간단히 살펴보고, 추후 실습을 위한 사이트도 함께 정리한다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post15;

