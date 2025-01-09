import React, { forwardRef, useContext } from 'react';

import BaseFooter, {
	ModalFooterProps as BaseFooterProps,
} from 'react-bootstrap/ModalFooter';

import ModalContext from '../contexts/ModalContext';

import { FCA } from 'utils/helpers';

export interface FooterProps extends BaseFooterProps {
	as?: any;
}

const Footer: FCA<'div', FooterProps> = forwardRef<HTMLElement, FooterProps>(
	function Footer(props, ref) {
		const context = useContext(ModalContext);

		return !context?.loading && <BaseFooter ref={ref} {...props} />;
	},
);

export default Footer;
