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

    <div class="callout">
        <div class="callout-icon">💡</div>
        <div class="callout-text">
        <strong>Tip:</strong> 회원가입 시 이름과 Email만을 받을 것이기 때문에 옵션을 두 가지 선택하고, preferred user name과 case sensitive 옵션도 체크해준다.
        </div>
    </div>

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
