import React, { forwardRef, useContext } from 'react';

import BaseModalHeader, {
	ModalHeaderProps as BaseModalHeaderProps,
} from 'react-bootstrap/ModalHeader';

import ModalContext from '../contexts/ModalContext';

import { FCA } from 'utils/helpers';

export type ModalHeaderProps = BaseModalHeaderProps;

BaseModalHeader.displayName = 'BaseModalHeader';

const ModalHeader: FCA<'div', ModalHeaderProps> = forwardRef<
	HTMLDivElement,
	ModalHeaderProps
>(function ModalHeader({ closeButton, ...props }, ref) {
	const context = useContext(ModalContext);

	return (
		<BaseModalHeader
			ref={ref}
			{...props}
			closeButton={!context?.loading && closeButton}
		/>
	);
});

export default ModalHeader;
