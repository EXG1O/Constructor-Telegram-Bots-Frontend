import React, { ReactElement } from 'react';
import classNames from 'classnames';

import BaseBody, { CardBodyProps as BaseBodyProps } from 'react-bootstrap/CardBody';

export interface BodyProps extends BaseBodyProps {
	as?: any;
}

function Body({ className, ...props }: BodyProps): ReactElement<BodyProps> {
	return <BaseBody {...props} className={classNames(className, 'p-2')} />;
}

export default Body;