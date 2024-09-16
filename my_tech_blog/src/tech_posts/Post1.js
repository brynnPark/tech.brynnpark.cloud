// src/tech_posts/Post1.js
import React from 'react';

const Post1 = {
  id: 1,
  slug: 'project-design-requirements-analysis',
  title: '1. 프로젝트 설계 - 요구사항 분석: SRS, 요구사항 명세서',
  date: 'September 15, 2024',
  tags: ['Project Design', 'Requirements Analysis', 'SRS'],
  excerpt: 'In this post, we explore the basics of cloud-native architecture, including its core components like containers, microservices, and orchestration...',
  content: (
    <div>
      <h2>개요</h2>
      <p>
        요구사항 분석은 프로젝트 아이디어를 제시한 제가 주도하여 작성한 뒤, 팀원들에게 공유하고 피드백을 받는 방식으로 진행했습니다.
      </p>
      {/* More content */}
    </div>
  ),
};

export default Post1;
