import React, { HTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';

import Markdown from 'components/Markdown';

import { Section } from 'api/donations/types';

import('styles/dynamic-content.scss');

export interface SectionDisplayProps extends HTMLAttributes<HTMLDivElement> {
  section: Section;
}

function SectionDisplay({
  section,
  className,
  ...props
}: SectionDisplayProps): ReactElement<SectionDisplayProps> {
  return (
    <div {...props} className={classNames('dynamic-content', className)}>
      <h3 className='mb-1'>{section.title}</h3>
      <Markdown>{section.text}</Markdown>
    </div>
  );
}

export default SectionDisplay;
