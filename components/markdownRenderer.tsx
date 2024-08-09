import React from 'react';
import ReactMarkdown from 'react-markdown';

export interface markdownProps
{
  markdownContent: string;
}

const MarkdownRenderer: React.FC<markdownProps> = ({ markdownContent }) =>
{ 
	return (
		<div className="h-[80vh] overflow-y-auto slick-scrollbar">
		<ReactMarkdown>{markdownContent}</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
