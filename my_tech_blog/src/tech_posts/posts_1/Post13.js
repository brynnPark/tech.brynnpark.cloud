import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'
import postContent from '../post_content/Post13.md';

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'MLOps란?';

const Post13 = {
  id: 13,
  slug: SlugGenerator(title),
  title: title,
  date: 'March, 2025',
  tags: ['MLOps', 'MLflow','AI'],
  excerpt: '이 글은 MLOps의 개념과 장단점, 실제 기업 활용 사례를 소개하며, ML 생애주기를 어떻게 체계화하고 자동화하는지 설명한다. MLflow, Kubeflow, Airflow 등 주요 도구를 비교하고, 단계별로 MLOps를 구축하는 방법과 툴 선택 가이드도 함께 제공한다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post13;

