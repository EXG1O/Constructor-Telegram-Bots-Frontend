import React, { ReactElement, memo } from 'react';
import classNames from 'classnames';

import Button, { ButtonProps } from 'react-bootstrap/Button';

export type AddButtonProps = ButtonProps;

const iconFontSizes: Record<NonNullable<AddButtonProps['size']>, number> = { 'sm': 21, 'lg': 30 };

function AddButton({ size, className, children, ...props }: AddButtonProps): ReactElement<AddButtonProps> {
	const paddingStart: number = size === 'sm' ? 1 : 2;
	const iconFontSize: number = size ? iconFontSizes[size] : 24;

	return (
		<Button
			{...props}
			size={size}
			className={classNames(`d-flex justify-content-center ps-${paddingStart}`, className)}
		>
			<i
				className='d-flex bi bi-plus'
				style={{ fontSize: `${iconFontSize}px` }}
			/>
			{children}
		</Button>
	);
}

export default memo(AddButton);