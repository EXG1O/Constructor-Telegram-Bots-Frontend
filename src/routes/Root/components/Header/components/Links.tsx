import React, { ReactElement, ReactNode, memo } from 'react';
import { Link, LinkProps as BaseLinkProps, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import Nav, { NavProps } from 'react-bootstrap/Nav';

export type LinksProps = Omit<NavProps, 'variant' | 'children'>;

export interface LinkProps extends BaseLinkProps {
	children: ReactNode;
}

const links: LinkProps[] = [
	{ to: '/', children: gettext('Главная') },
	{ to: '/instruction/', children: gettext('Инструкция') },
	{ to: '/updates/', children: gettext('Обновления') },
	{ to: '/donation/', children: gettext('Пожертвование') },
];

function Links({ className, ...props }: LinksProps): ReactElement<LinksProps> {
	const location = useLocation();

	return (
		<Nav
			{...props}
			variant='underline'
			className={classNames('gap-0', className)}
		>
			{links.map(({ className, ...props }, index) => (
				<Link
					key={index}
					{...props}
					className={
						classNames(
							'nav-link pb-1',
							{ active: location.pathname === props.to },
							className,
						)
					}
				/>
			))}
		</Nav>
	);
}

export default memo(Links);