import React, { ReactElement, HTMLAttributes, memo } from 'react';

import classNames from 'classnames';

import Loading from '../../Loading';

export type EditorLoadingProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function EditorLoading({
	className,
	...props
}: EditorLoadingProps): ReactElement<EditorLoadingProps> {
	return (
		<div
			{...props}
			className={classNames('d-flex justify-content-center w-100 p-2', className)}
		>
			<Loading size='sm' />
		</div>
	);
}

export default memo(EditorLoading);
