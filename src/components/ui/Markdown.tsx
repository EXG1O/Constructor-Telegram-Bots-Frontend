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
        h1: ({ node, className, ...props }) => {
          return <h1 {...props} className={cn('text-5xl', 'font-medium', className)} />;
        },
        h2: ({ node, className, ...props }) => {
          return <h2 {...props} className={cn('text-4xl', 'font-medium', className)} />;
        },
        h3: ({ node, className, ...props }) => {
          return <h3 {...props} className={cn('text-3xl', 'font-medium', className)} />;
        },
        h4: ({ node, className, ...props }) => {
          return <h4 {...props} className={cn('text-2xl', 'font-medium', className)} />;
        },
        h5: ({ node, className, ...props }) => {
          return <h5 {...props} className={cn('text-xl', 'font-medium', className)} />;
        },
        h6: ({ node, className, ...props }) => {
          return (
            <h6 {...props} className={cn('text-base', 'font-medium', className)} />
          );
        },
        p: ({ node, className, ...props }) => {
          return <p {...props} className={cn('not-last:mb-2', className)} />;
        },
        a: ({ node, className, ...props }) => {
          return (
            <a
              {...props}
              target='_blank'
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
