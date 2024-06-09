import React, { ReactElement } from 'react';
import classNames from 'classnames';

import BaseCardBody, {
	CardBodyProps as BaseCardBodyProps,
} from 'react-bootstrap/CardBody';

export type BlockBodyProps = BaseCardBodyProps;

function BlockBody({
	className,
	...props
}: BlockBodyProps): ReactElement<BlockBodyProps> {
	return <BaseCardBody {...props} className={classNames(className, 'p-2')} />;
}

export default BlockBody;
