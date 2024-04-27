import React, { ReactElement, ReactNode, HTMLAttributes, memo } from 'react';

export interface InfoAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	value: number | string;
	description: string;
}

function InfoArea({ value, description, ...props }: InfoAreaProps): ReactElement<InfoAreaProps> {
	return (
		<div {...props}>
			<div className='fw-semibold border border-2 rounded-4 p-2'>{value}</div>
			<span>{description}</span>
		</div>
	);
}

export default memo(InfoArea);