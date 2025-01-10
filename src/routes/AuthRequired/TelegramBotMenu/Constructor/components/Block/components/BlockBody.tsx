import React, { forwardRef } from 'react';
import classNames from 'classnames';

import BaseCardBody, {
	CardBodyProps as BaseCardBodyProps,
} from 'react-bootstrap/CardBody';

import { FCA } from 'utils/helpers';

export type BlockBodyProps = BaseCardBodyProps;

const BlockBody: FCA<'div', BlockBodyProps> = forwardRef<HTMLElement, BlockBodyProps>(
	function BlockBody({ className, ...props }, ref) {
		return (
			<BaseCardBody
				ref={ref}
				{...props}
				className={classNames(className, 'p-2')}
			/>
		);
	},
);

export default BlockBody;
