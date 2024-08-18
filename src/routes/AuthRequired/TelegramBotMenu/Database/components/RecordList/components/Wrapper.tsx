import React, { HTMLAttributes, memo, ReactElement } from 'react';
import classNames from 'classnames';

export type WrapperProps = HTMLAttributes<HTMLDivElement>;

function Wrapper({ className, ...props }: WrapperProps): ReactElement<WrapperProps> {
	return <div {...props} className={classNames('border rounded-1', className)} />;
}

export default memo(Wrapper);
