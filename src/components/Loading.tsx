import React, { ReactElement, memo } from 'react';

import Spinner, { SpinnerProps } from 'react-bootstrap/Spinner';

export interface LoadingProps extends Omit<SpinnerProps, 'size' | 'animation' | 'children'> {
	size: keyof typeof multipliers;
}

const multipliers = { 'xs': 1, 'sm': 2, 'md': 3, 'lg': 4, 'xl': 5 };

function Loading({ size, style, ...props }: LoadingProps): ReactElement<LoadingProps> {
	const multiplier: number = multipliers[size];

	return (
		<Spinner
			{...props}
			animation='border'
			style={{
				width: `${1 + 0.5 * multiplier}rem`,
				height: `${1 + 0.5 * multiplier}rem`,
				borderWidth: `${0.1 + 0.05 * multiplier}rem`,
				...style,
			}}
		/>
	);
}

export default memo(Loading);