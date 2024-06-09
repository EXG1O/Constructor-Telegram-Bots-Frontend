import React, { ReactElement } from 'react';
import classNames from 'classnames';

import BaseCardFooter, {
	CardFooterProps as BaseCardFooterProps,
} from 'react-bootstrap/CardFooter';

export type BlockFooterProps = BaseCardFooterProps;

function BlockFooter({
	className,
	...props
}: BlockFooterProps): ReactElement<BlockFooterProps> {
	return <BaseCardFooter {...props} className={classNames(className, 'p-2')} />;
}

export default BlockFooter;
