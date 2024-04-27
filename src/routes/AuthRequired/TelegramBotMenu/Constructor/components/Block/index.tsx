import React, { ReactElement } from 'react';

import Card, { CardProps } from 'react-bootstrap/Card';

import Body from './components/Body';

export interface BlockProps extends CardProps {
	as?: any;
	title: string;
}

function Block({ title, children, ...props }: BlockProps): ReactElement<BlockProps> {
	return (
		<Card {...props}>
			<Card.Header
				as='h6'
				className='text-center'
			>
				{title}
			</Card.Header>
			{children}
		</Card>
	);
}

export default Object.assign(Block, { Body });