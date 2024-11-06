import React from 'react';

const TableOfContents = ({ headings }) => {
  if (!headings || headings.length === 0) {
    return null;
  }

  const handleClick = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="table-of-contents">
      <h2>Table of Contents</h2>
      <ul>
        {headings.map((heading, index) => (
          <li key={index} style={{ paddingLeft: `${(heading.level - 1) * 20}px` }}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(heading.id);
              }}
              data-level={heading.level}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
