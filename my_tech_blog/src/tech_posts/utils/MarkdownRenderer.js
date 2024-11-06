// src/utils/MarkdownRenderer.js
import React from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Example theme, can be customized

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
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