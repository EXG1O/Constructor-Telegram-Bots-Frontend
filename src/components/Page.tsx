import React, { ReactElement, ReactNode, memo } from 'react';
import classNames from 'classnames';

import Container, { ContainerProps } from 'react-bootstrap/Container';

import Title from './Title';

export interface PageProps {
	title: string;
	align?: 'center';
	grid?: boolean;
	className?: string;
	children: ReactNode;
}

function Page({
	title,
	align,
	grid,
	className,
	children,
}: PageProps): ReactElement<PageProps> {
	const containerProps: Omit<ContainerProps, 'as'> = {
		className: classNames(
			'my-2 my-lg-3',
			{ 'vstack gap-3 gap-lg-4': grid },
			className,
		),
		children,
	};

	return (
		<Title title={title}>
			{align === 'center' ? (
				<main className='my-auto'>
					<Container {...containerProps} />
				</main>
			) : (
				<Container as='main' {...containerProps} />
			)}
		</Title>
	);
}

export default memo(Page);
