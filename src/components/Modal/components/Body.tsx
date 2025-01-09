import React, { forwardRef, useContext } from 'react';

import BaseBody, { ModalBodyProps as BaseBodyProps } from 'react-bootstrap/ModalBody';

import ModalContext from '../contexts/ModalContext';

import { FCA } from 'utils/helpers';

export type BodyProps = BaseBodyProps;

const Body: FCA<'div', BodyProps> = forwardRef<HTMLElement, BodyProps>(
	function Body(props, ref) {
		const context = useContext(ModalContext);

		return !context?.loading && <BaseBody ref={ref} {...props} />;
	},
);

export default Body;
