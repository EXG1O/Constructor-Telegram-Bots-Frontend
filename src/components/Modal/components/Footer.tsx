import React, { ReactElement, useContext } from 'react';

import BaseFooter, { ModalFooterProps as BaseFooterProps } from 'react-bootstrap/ModalFooter';

import ModalContext from '../contexts/ModalContext';

export interface FooterProps extends BaseFooterProps {
	as?: any;
}

function Footer(props: FooterProps): ReactElement<FooterProps> {
	const context = useContext(ModalContext);

	return !context?.loading ? <BaseFooter {...props} /> : <></>;
}

export default Footer;