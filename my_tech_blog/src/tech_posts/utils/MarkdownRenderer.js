import React from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use((md) => {
  // Add `id` attribute to headings
  md.renderer.rules.heading_open = function (tokens, idx) {
    const title = tokens[idx + 1].content;
    const id = title.replace(/\s+/g, '-').toLowerCase();
    return `<h${tokens[idx].tag.slice(1)} id="${id}">`;
  };
});

const MarkdownRenderer = ({ markdownText }) => {
  const htmlContent = md.render(markdownText);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
