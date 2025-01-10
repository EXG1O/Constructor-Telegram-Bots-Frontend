import React, { forwardRef, useContext } from 'react';

import BaseHeader, {
	OffcanvasHeaderProps as BaseHeaderProps,
} from 'react-bootstrap/OffcanvasHeader';

import OffcanvasContext from '../contexts/OffcanvasContext';

export type HeaderProps = BaseHeaderProps;

const Header = forwardRef<HTMLDivElement, HeaderProps>(function Header(
	{ closeButton, ...props },
	ref,
) {
	const context = useContext(OffcanvasContext);

	return (
		<BaseHeader
			ref={ref}
			{...props}
			closeButton={!context?.loading && closeButton}
		/>
	);
});

export default Header;
