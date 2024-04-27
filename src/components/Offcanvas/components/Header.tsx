import React, { ReactElement, useContext } from 'react';

import BaseHeader, { OffcanvasHeaderProps as BaseHeaderProps } from 'react-bootstrap/OffcanvasHeader';

import OffcanvasContext from '../contexts/OffcanvasContext';

export type HeaderProps = BaseHeaderProps;

function Header({ closeButton, ...props }: HeaderProps): ReactElement<HeaderProps> {
	const context = useContext(OffcanvasContext);

	return <BaseHeader {...props} closeButton={!context?.loading && closeButton}  />;
}

export default Header;