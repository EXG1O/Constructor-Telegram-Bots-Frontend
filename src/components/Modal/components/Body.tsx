import React, { ReactElement, useContext } from 'react';

import BaseBody, { ModalBodyProps as BaseBodyProps } from 'react-bootstrap/ModalBody';

import ModalContext from '../contexts/ModalContext';

export interface BodyProps extends BaseBodyProps {
	as?: any;
}

function Body(props: BodyProps): ReactElement<BodyProps> {
	const context = useContext(ModalContext);

	return !context?.loading ? <BaseBody {...props} /> : <></>;
}

export default Body;