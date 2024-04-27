import React, { ReactElement, HTMLAttributes, useContext } from 'react';
import classNames from 'classnames';

import OffcanvasContext from '../contexts/OffcanvasContext';

export type FooterProps = HTMLAttributes<HTMLDivElement>;

function Footer({ className, ...props }: FooterProps): ReactElement<FooterProps> {
	const context = useContext(OffcanvasContext);

	return (
		!context?.loading ? (
			<div {...props} className={classNames('offcanvas-footer', className)} />
		) : <></>
	);
}

export default Footer;