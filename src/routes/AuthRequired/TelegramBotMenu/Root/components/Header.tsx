import React, { ReactElement, ReactNode, AnchorHTMLAttributes, useMemo } from 'react';
import { Link, LinkProps, useLocation, useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import { reverse } from 'routes';

import Nav from 'react-bootstrap/Nav';
import { NavLinkProps } from 'react-bootstrap/NavLink';

import { LoaderData as TelegramBotMenuRootLoaderData } from '..';

export interface HeaderLinkProps
	extends NavLinkProps,
		Omit<LinkProps, keyof AnchorHTMLAttributes<HTMLAnchorElement>> {
	children: ReactNode;
}

function Header(): ReactElement {
	const location = useLocation();
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const headerLinks = useMemo<HeaderLinkProps[]>(() => {
		const baseID: string = 'telegram-bot-menu';
		const params: Record<string, string | number> = {
			telegramBotID: telegramBot.id,
		};

		return [
			{
				to: reverse(`${baseID}-index`, params),
				children: gettext('Telegram бот'),
			},
			{
				to: reverse(`${baseID}-variables`, params),
				children: gettext('Переменные'),
			},
			{
				to: reverse(`${baseID}-users`, params),
				children: gettext('Пользователи'),
			},
			{
				to: reverse(`${baseID}-database`, params),
				children: gettext('База данных'),
			},
			{
				to: reverse(`${baseID}-constructor`, params),
				children: gettext('Конструктор'),
			},
		];
	}, [telegramBot]);

	return (
		<Nav variant='pills' className='nav-fill bg-light border rounded gap-2 p-2'>
			{headerLinks.map(({ to, className, ...props }, index) => (
				<Link
					{...props}
					key={index}
					to={to}
					className={classNames(
						'nav-link',
						{ active: location.pathname === to },
						className,
					)}
				/>
			))}
		</Nav>
	);
}

export default Header;
