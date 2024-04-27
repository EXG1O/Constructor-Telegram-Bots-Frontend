import React, { ReactElement, useContext } from 'react';

import BaseBody, { OffcanvasBodyProps as BaseBodyProps } from 'react-bootstrap/OffcanvasBody';

import OffcanvasContext from '../contexts/OffcanvasContext';

export interface BodyProps extends BaseBodyProps {
	as?: any;
}

function Body(props: BodyProps): ReactElement<BodyProps> {
	const context = useContext(OffcanvasContext);

	return !context?.loading ? <BaseBody {...props} /> : <></>;
}

export default Body;