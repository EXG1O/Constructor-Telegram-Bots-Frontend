import React, { ReactElement, HTMLAttributes, memo } from 'react';
import classNames from 'classnames';

export type BlockProps = HTMLAttributes<HTMLDivElement>;

function Block({ className, ...props }: BlockProps): ReactElement<BlockProps> {
	return <div {...props} className={classNames('border rounded-1', className)} />;
}

export default memo(Block);