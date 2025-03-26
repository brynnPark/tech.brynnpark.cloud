import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'
import postContent from '../post_content/Post14.md';

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'Observability (1)';

const Post14 = {
  id: 14,
  slug: SlugGenerator(title),
  title: title,
  date: 'March, 2025',
  tags: ['Observability', 'Logging', 'Monitoring', 'Tracing', 'DevOps'],
  excerpt: '이 글은 Observability(가시성)의 개념과 중요성, 그리고 Logs, Metrics, Traces로 구성된 3대 요소를 중심으로 시스템 내부 상태를 효과적으로 관찰하고 분석하는 방법에 대해 다룬다. 또한 모니터링과의 차이점, 활용 분야, 도입 시의 장점과 함께 데이터 사일로, 복잡성 증가 등의 도전 과제에 대해서도 자세히 설명한다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post14;

