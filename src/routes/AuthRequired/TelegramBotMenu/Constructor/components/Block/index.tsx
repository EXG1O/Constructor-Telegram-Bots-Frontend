import React, { ReactElement } from 'react';

import Card, { CardProps } from 'components/Card';

import BlockBody from './components/BlockBody';
import BlockFooter from './components/BlockFooter';

export interface BlockProps extends CardProps {
	title: string;
}

function Block({
	title,
	body,
	children,
	...props
}: BlockProps): ReactElement<BlockProps> {
	return (
		<Card {...props}>
			<Card.Header as='h6' className='text-center'>
				{title}
			</Card.Header>
			{body ? <BlockBody>{children}</BlockBody> : children}
		</Card>
	);
}

export default Object.assign(Block, { Body: BlockBody, Footer: BlockFooter });
