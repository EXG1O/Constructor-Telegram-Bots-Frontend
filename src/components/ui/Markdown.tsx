import React from 'react';
import { ReactElement } from 'react';
import BaseMarkdown, { Options } from 'react-markdown';

import cn from 'utils/cn';

export interface MarkdownProps extends Options {}

export const DEFAULT_ALLOWED_ELEMENTS: NonNullable<MarkdownProps['allowedElements']> = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'strong',
  'b',
  'em',
  'code',
  'a',
  'ul',
  'ol',
  'li',
];

function Markdown({
  allowedElements = DEFAULT_ALLOWED_ELEMENTS,
  components,
  ...props
}: MarkdownProps): ReactElement {
  return (
    <BaseMarkdown
      unwrapDisallowed
      {...props}
      allowedElements={allowedElements}
      components={{
        p: ({ node, className, ...props }) => {
          return <p {...props} className={cn('not-last:mb-2', className)} />;
        },
        a: ({ node, className, ...props }) => {
          return (
            <a
              {...props}
              className={cn('text-primary', 'hover:text-primary-accent', className)}
            />
          );
        },
        ul: ({ node, className, ...props }) => {
          return (
            <ul
              {...props}
              className={cn('list-disc', 'ps-5.5', 'not-last:mb-2', className)}
            />
          );
        },
        ol: ({ node, className, ...props }) => {
          return (
            <ol
              {...props}
              className={cn('list-decimal', 'ps-6.5', 'not-last:mb-2', className)}
            />
          );
        },
        code: ({ node, className, ...props }) => {
          return (
            <code
              {...props}
              className={cn(
                'bg-light',
                'text-sm',
                'text-light-foreground',
                'rounded-sm',
                'px-1',
                'py-0.5',
                className,
              )}
            />
          );
        },
        ...components,
      }}
    />
  );
}

export default Markdown;
