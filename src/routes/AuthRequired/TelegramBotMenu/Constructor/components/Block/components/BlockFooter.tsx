import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { CardFooterProps } from 'react-bootstrap/CardFooter';

import Card from 'components/Card';

import { FCA } from 'utils/helpers';

export type BlockFooterProps = CardFooterProps;

const BlockFooter: FCA<'div', BlockFooterProps> = forwardRef<
	HTMLElement,
	BlockFooterProps
>(function BlockFooter({ className, ...props }, ref) {
	return (
		<Card.Footer ref={ref} {...props} className={classNames(className, 'p-2')} />
	);
});

export default BlockFooter;
