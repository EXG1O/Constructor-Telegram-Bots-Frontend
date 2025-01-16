import React, { HTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';

import { Section } from 'api/instruction/types';

import('styles/dynamic-content.scss');

export interface SectionDisplayProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
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
			<div dangerouslySetInnerHTML={{ __html: section.text }} />
		</div>
	);
}

export default SectionDisplay;
