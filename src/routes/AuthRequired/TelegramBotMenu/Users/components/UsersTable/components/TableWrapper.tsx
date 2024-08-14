import React, { HTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';

export type BlockProps = HTMLAttributes<HTMLDivElement>;

function TableWrapper({ className, ...props }: BlockProps): ReactElement {
	return <div {...props} className={classNames('border rounded-1', className)} />;
}

export default TableWrapper;
