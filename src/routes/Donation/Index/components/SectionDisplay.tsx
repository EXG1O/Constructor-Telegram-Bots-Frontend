import React, { ReactElement, HTMLAttributes } from 'react';
import classNames from 'classnames';

import './SectionDisplay.scss';

import { Section } from 'services/api/donations/types';

export interface SectionDisplayProps extends HTMLAttributes<HTMLDivElement> {
	section: Section;
}

function SectionDisplay({ section, className, ...props }: SectionDisplayProps): ReactElement<SectionDisplayProps> {
	return (
		<div {...props} className={classNames('donation-section', className)}>
			<h3 className='mb-1'>{section.title}</h3>
			<div dangerouslySetInnerHTML={{ __html: section.text }} />
		</div>
	);
}

export default SectionDisplay;