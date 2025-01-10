import React, { forwardRef, useContext } from 'react';

import BaseBody, {
	OffcanvasBodyProps as BaseBodyProps,
} from 'react-bootstrap/OffcanvasBody';

import OffcanvasContext from '../contexts/OffcanvasContext';

import { FCA } from 'utils/helpers';

export type BodyProps = BaseBodyProps;

const Body: FCA<'div', BodyProps> = forwardRef<HTMLElement, BodyProps>(
	function Body(props, ref) {
		const context = useContext(OffcanvasContext);

		return !context?.loading && <BaseBody ref={ref} {...props} />;
	},
);

export default Body;
