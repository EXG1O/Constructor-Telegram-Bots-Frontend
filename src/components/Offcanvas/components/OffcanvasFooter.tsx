import React, { forwardRef, HTMLAttributes, useContext } from 'react';
import classNames from 'classnames';

import OffcanvasContext from '../contexts/OffcanvasContext';

import { AsProp, FCA } from 'utils/helpers';

export type OffcanvasFooterProps = AsProp & HTMLAttributes<HTMLDivElement>;

const OffcanvasFooter: FCA<'div', OffcanvasFooterProps> = forwardRef<
	HTMLElement,
	OffcanvasFooterProps
>(function OffcanvasFooter({ as: Component = 'div', className, ...props }, ref) {
	const context = useContext(OffcanvasContext);

	return (
		!context?.loading && (
			<Component
				ref={ref}
				{...props}
				className={classNames('offcanvas-footer', className)}
			/>
		)
	);
});

export default OffcanvasFooter;
