import React, { forwardRef } from 'react';
import classNames from 'classnames';

import BaseCardFooter, {
	CardFooterProps as BaseCardFooterProps,
} from 'react-bootstrap/CardFooter';

import { FCA } from 'utils/helpers';

export type BlockFooterProps = BaseCardFooterProps;

const BlockFooter: FCA<'div', BlockFooterProps> = forwardRef<
	HTMLElement,
	BlockFooterProps
>(function BlockFooter({ className, ...props }, ref) {
	return (
		<BaseCardFooter ref={ref} {...props} className={classNames(className, 'p-2')} />
	);
});

export default BlockFooter;
