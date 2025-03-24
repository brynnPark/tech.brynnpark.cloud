// MarkdownViewer.jsx
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

const MarkdownViewer = ({ content }) => {
  return (
    <div data-color-mode="light">
      <MDEditor.Markdown source={content} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
};

export default MarkdownViewer;
