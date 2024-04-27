import React, { ReactElement, useContext } from 'react';

import BaseHeader, { ModalHeaderProps as BaseHeaderProps } from 'react-bootstrap/ModalHeader';

import ModalContext from '../contexts/ModalContext';

export type HeaderProps = BaseHeaderProps;

function Header({ closeButton, ...props }: HeaderProps): ReactElement<HeaderProps> {
	const context = useContext(ModalContext);

	return <BaseHeader {...props} closeButton={!context?.loading && closeButton} />;
}

export default Header;