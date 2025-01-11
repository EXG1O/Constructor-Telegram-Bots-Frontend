import React, { HTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';

import { Update } from 'api/updates/types';

import('styles/dynamic-content.scss');

export interface UpdateDisplayProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML'> {
	update: Update;
}

function UpdateDisplay({
	update,
	className,
	...props
}: UpdateDisplayProps): ReactElement<UpdateDisplayProps> {
	return (
		<div
			{...props}
			className={classNames('dynamic-content border rounded p-3', className)}
			dangerouslySetInnerHTML={{ __html: update.description }}
		/>
	);
}

export default UpdateDisplay;
