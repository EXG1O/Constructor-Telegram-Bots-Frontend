import React, { forwardRef, HTMLAttributes, useContext } from 'react';
import classNames from 'classnames';

import OffcanvasContext from '../contexts/OffcanvasContext';

import { AsProp, FCA } from 'utils/helpers';

export type FooterProps = AsProp & HTMLAttributes<HTMLDivElement>;

const Footer: FCA<'div', FooterProps> = forwardRef<HTMLElement, FooterProps>(
	function Footer({ as: Component = 'div', className, ...props }, ref) {
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
	},
);

export default Footer;
