import React, { forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';

import { FCA } from 'utils/helpers';

export interface NodeBlockProps extends HTMLAttributes<HTMLDivElement> {
	variant?: string;
}

const NodeBlock: FCA<'div', NodeBlockProps> = forwardRef<
	HTMLDivElement,
	NodeBlockProps
>(function NodeBlock({ variant = 'white', className, ...props }, ref) {
	return (
		<div
			{...props}
			ref={ref}
			className={classNames(
				className,
				`text-bg-${variant} border rounded px-3 py-2`,
			)}
		/>
	);
});

export default NodeBlock;
