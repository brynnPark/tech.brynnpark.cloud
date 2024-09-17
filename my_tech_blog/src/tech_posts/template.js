// src/tech_posts/Post1.js
import React from 'react';

// Table of Contents Component
const TableOfContents = () => (
  <nav className="table-of-contents">
    <div>
      <a href="#aws-intro">1 AWS 소개</a>
    </div>
    <div>
      <a href="#cloud-computing">Cloud Computing</a>
    </div>
    <div>
      <a href="#global-infrastructure">Global Infrastructure</a>
    </div>
    <div>
      <a href="#aws-security">보안: AWS 공동 책임 모델</a>
    </div>
    {/* Add more items as needed */}
  </nav>
);

// Main Content Component
const MainContent = () => (
  <div>
    <h1 id="aws-intro">1 AWS 소개</h1>
    <h2 id="cloud-computing">Cloud Computing</h2>
    <ul>
      <li>인터넷을 통해 연결</li>
      <li>온디맨드</li>
      <li>종량제 요금제</li>
    </ul>
    <h2 id="global-infrastructure">Global Infrastructure</h2>
    <ul>
      <li><strong>AZ(가용 영역)</strong>
        <ul>
          <li>하나 이상의 데이터 센터들의 집합</li>
          <li>데이터 센터는 수천에서 수만 대의 서버의 집합</li>
        </ul>
      </li>
    </ul>
    {/* Add more sections as needed */}
  </div>
);

const Post1 = {
  id: 1,
  slug: 'aws-technical-essentials',
  title: 'AWS: Technical Essentials',
  date: 'June, 2024',
  tags: ['AWS', 'Cloud Computing', 'Infrastructure'],
  excerpt: 'In this post, we explore the basics of aws cloud computing, including its core components like computing instances, networkings, storage, db ...',
  content: (
    <article>
    <header>
      <h1>Technical Essentials 0626</h1>
    </header>
    <TableOfContents />
    <MainContent />
  </article>
  )
};

export default Post1;
