import React, { ReactElement, HTMLAttributes } from 'react';
import classNames from 'classnames';

import './UpdateDisplay.scss';

import { Update } from 'services/api/updates/types';

export interface UpdateDisplayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML'> {
	update: Update;
}

function UpdateDisplay({ update, className, ...props }: UpdateDisplayProps): ReactElement<UpdateDisplayProps> {
	return (
		<div
			{...props}
			className={classNames('update-block border rounded p-3', className)}
			dangerouslySetInnerHTML={{ __html: update.description }}
		/>
	);
}

export default UpdateDisplay;