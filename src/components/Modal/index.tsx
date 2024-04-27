import React, { ReactElement, ReactNode } from 'react';

import BaseModal from 'react-bootstrap/Modal';
import { BaseModalProps } from '@restart/ui/Modal';

import Loading from '../Loading';

import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

import ModalContext from './contexts/ModalContext';

export interface ModalProps extends Omit<
	BaseModalProps,
	'role' |
	'renderBackdrop' |
	'renderDialog' |
	'transition' |
	'backdropTransition' |
	'children'
> {
	loading?: boolean;
    size?: 'sm' | 'lg' | 'xl';
    fullscreen?: true | string | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
    bsPrefix?: string;
    centered?: boolean;
    backdropClassName?: string;
    animation?: boolean;
    dialogClassName?: string;
    contentClassName?: string;
    dialogAs?: React.ElementType;
    scrollable?: boolean;
	children?: ReactNode;
}

/** The wrapper component adds support for the `loading` prop to the Modal component from `react-bootstrap`. */
function Modal({ loading = false, backdrop, keyboard, children, ...props }: ModalProps): ReactElement<ModalProps> {
	return (
		<ModalContext.Provider value={{ loading }}>
			<BaseModal
				{...props}
				backdrop={loading ? 'static' : backdrop}
				keyboard={!loading && keyboard}
			>
				{children}
				{loading && (
					<BaseModal.Body className='d-flex justify-content-center'>
						<Loading size='md' />
					</BaseModal.Body>
				)}
			</BaseModal>
		</ModalContext.Provider>
	);
}

export default Object.assign(Modal, { Header, Title: BaseModal.Title, Body, Footer });