import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'
import postContent from '../post_content/Post16.md';

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const imgBaseUrl = `${process.env.REACT_APP_S3_IMG_URL}`;
const parsedContent = postContent.replaceAll('{{imgBaseUrl}}', imgBaseUrl);

const title = 'Bastion Host, Load Balancer를 이용한 EC2 접근 및 보안된 네트워크 구성하기';

const Post16 = {
  id: 15,
  slug: SlugGenerator(title),
  title: title,
  date: 'May, 2025',
  tags: ['AWS', 'Cloud Computing', 'Networking', 'VPC', 'EC2'],
  excerpt: '이 글에선 AWS에서 Bastion Host와 Load Balancer를 이용하여 여러 private subnet에 배포된 웹 서버 EC2 인스턴스에 접근하고 보안된 네트워크를 구성하는 방법을 설명한다. 외부 접근에 대한 보안과 네트워크 설정에 대해서 공부하고, 로드밸런싱에 대해서 알아본다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={parsedContent} /> // Render markdown using the MarkdownRenderer
};

export default Post16;

