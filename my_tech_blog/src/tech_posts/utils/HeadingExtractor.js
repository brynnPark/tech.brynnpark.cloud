// src/utils/HeadingExtractor.js
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt();

const HeadingExtractor = (markdownText) => {
  const tokens = mdParser.parse(markdownText, {});
  const headings = [];

  tokens.forEach((token, index) => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.slice(1), 10); // Extract heading level
      const title = tokens[index + 1].content;         // Get the title from the next token
      const id = title.replace(/\s+/g, '-').toLowerCase(); // Generate ID by converting spaces to hyphens

      headings.push({ id, title, level });
    }
  });

  return headings;
};

export default HeadingExtractor;
