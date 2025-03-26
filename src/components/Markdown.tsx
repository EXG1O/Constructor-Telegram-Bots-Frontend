import React from 'react';
import { ReactElement } from 'react';
import BaseMarkdown, { Options as MarkdownProps } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export type { MarkdownProps };

function Markdown({
  remarkPlugins,
  rehypePlugins,
  ...props
}: MarkdownProps): ReactElement {
  return (
    <BaseMarkdown
      {...props}
      remarkPlugins={[...(remarkPlugins ?? []), remarkGfm]}
      rehypePlugins={[...(rehypePlugins ?? []), rehypeRaw]}
    />
  );
}

export default Markdown;
