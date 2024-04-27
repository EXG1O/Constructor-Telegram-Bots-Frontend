import React, { ReactElement, HTMLAttributes } from 'react';
import classNames from 'classnames';

import './SectionDisplay.scss';

import { Section } from 'services/api/privacy_policy/types';

export interface SectionDisplayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	section: Section;
}

function SectionDisplay({ section, className, ...props }: SectionDisplayProps): ReactElement<SectionDisplayProps> {
	return (
		<div {...props} className={classNames('privacy-policy-section', className)}>
			<h3 className='mb-1'>{section.title}</h3>
			<div dangerouslySetInnerHTML={{ __html: section.text }} />
		</div>
	);
}

export default SectionDisplay;