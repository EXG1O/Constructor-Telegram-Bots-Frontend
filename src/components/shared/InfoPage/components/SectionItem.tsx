import React, { type HTMLAttributes, type ReactElement } from 'react';

import Markdown from 'components/ui/Markdown';

import cn from 'utils/cn';

import type { Section } from '..';

export interface SectionItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  section: Section;
}

function SectionItem({ section, className, ...props }: SectionItemProps): ReactElement {
  return (
    <div {...props} className={cn('text-foreground', className)}>
      <h3 className='mb-1 text-3xl font-semibold'>{section.title}</h3>
      <Markdown>{section.text}</Markdown>
    </div>
  );
}

export default SectionItem;
