import React from 'react';

const TableOfContents = ({ headings }) => {
  // If headings is empty, do not render the Table of Contents
  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <nav className="table-of-contents">
      <h2> Table of Contents</h2>
      <ul>
        {headings.map((heading, index) => (
          <li key={index} style={{ paddingLeft: `${heading.level * 10}px` }}>
            {/* Use data-level to distinguish between h1 and h2 */}
            <a href={`#${heading.id}`} data-level={heading.level}>{heading.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
