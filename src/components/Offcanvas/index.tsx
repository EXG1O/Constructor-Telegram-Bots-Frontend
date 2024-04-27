import React, { ReactElement, ReactNode } from 'react';

import BaseOffcanvas from 'react-bootstrap/Offcanvas';
import Title from 'react-bootstrap/OffcanvasTitle';
import { BaseModalProps } from '@restart/ui/Modal';

import Loading from '../Loading';

import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

import OffcanvasContext from './contexts/OffcanvasContext';

export interface OffcanvasProps extends Omit<
	BaseModalProps,
	'role' |
	'renderBackdrop' |
	'renderDialog' |
	'transition' |
	'backdrop' |
	'backdropTransition' |
	'keyboard' |
	'children'
> {
	loading?: boolean;
	bsPrefix?: string;
    backdropClassName?: string;
    scroll?: boolean;
    placement?: 'start' | 'end' | 'top' | 'bottom';
    responsive?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    renderStaticNode?: boolean;
	children?: ReactNode;
}

/** The wrapper component adds support for the `loading` prop to the Offcanvas component from `react-bootstrap`. */
function Offcanvas({ loading = false, children, ...props }: OffcanvasProps): ReactElement<OffcanvasProps> {
	return (
		<OffcanvasContext.Provider value={{ loading }}>
			<BaseOffcanvas {...props}>
				{children}
				{loading && (
					<BaseOffcanvas.Body className='d-flex justify-content-center'>
						<Loading size='md' className='align-self-center' />
					</BaseOffcanvas.Body>
				)}
			</BaseOffcanvas>
		</OffcanvasContext.Provider>
	);
}

export default Object.assign(Offcanvas, { Header, Title, Body, Footer });