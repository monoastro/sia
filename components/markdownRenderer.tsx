import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props
{
  markdownContent: string;
}

const MarkdownRenderer: React.FC<Props> = ({ markdownContent }) => { return (
    <div className="h-[80vh] overflow-y-auto slick-scrollbar">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
};
export {MarkdownRenderer};
