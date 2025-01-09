import React, { forwardRef, useContext } from 'react';

import BaseHeader, {
	ModalHeaderProps as BaseHeaderProps,
} from 'react-bootstrap/ModalHeader';

import ModalContext from '../contexts/ModalContext';

import { FCA } from 'utils/helpers';

export type HeaderProps = BaseHeaderProps;

const Header: FCA<'div', HeaderProps> = forwardRef<HTMLDivElement, HeaderProps>(
	function Header({ closeButton, ...props }, ref) {
		const context = useContext(ModalContext);

		return (
			<BaseHeader
				ref={ref}
				{...props}
				closeButton={!context?.loading && closeButton}
			/>
		);
	},
);

export default Header;
