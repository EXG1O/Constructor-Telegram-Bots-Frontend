import React, { ReactElement, ReactNode } from 'react';

import BaseModal from 'react-bootstrap/Modal';
import { BaseModalProps } from '@restart/ui/Modal';

import Loading from '../Loading';

import Header from './components/Header';
import Title from './components/Title';
import Body from './components/Body';
import Footer from './components/Footer';

import ModalContext from './contexts/ModalContext';

export interface ModalProps
	extends Omit<
		BaseModalProps,
		| 'role'
		| 'transition'
		| 'backdropTransition'
		| 'renderBackdrop'
		| 'renderDialog'
		| 'children'
	> {
	loading?: boolean;
	size?: 'sm' | 'lg' | 'xl';
	fullscreen?: 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
	animation?: boolean;
	centered?: boolean;
	backdropClassName?: string;
	dialogClassName?: string;
	contentClassName?: string;
	dialogAs?: React.ElementType;
	scrollable?: boolean;
	children?: ReactNode;
}

function Modal({
	loading = false,
	backdrop,
	keyboard,
	children,
	...props
}: ModalProps): ReactElement<ModalProps> {
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

export default Object.assign(Modal, { Header, Title, Body, Footer });
