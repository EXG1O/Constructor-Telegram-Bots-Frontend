import React, { ReactElement, ReactNode, AnchorHTMLAttributes } from 'react';
import { Link, LinkProps, useLocation, useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import Nav from 'react-bootstrap/Nav';
import { NavLinkProps } from 'react-bootstrap/NavLink';

import { LoaderData as TelegramBotMenuRootLoaderData } from '..';

export interface HeaderLinkProps extends NavLinkProps, Omit<LinkProps, keyof AnchorHTMLAttributes<HTMLAnchorElement>> {
	children: ReactNode;
}

const headerLinks: HeaderLinkProps[] = [
	{ to: '', children: gettext('Telegram бот') },
	{ to: 'variables/', children: gettext('Переменные') },
	{ to: 'users/', children: gettext('Пользователи') },
	{ to: 'database/', children: gettext('База данных') },
	{ to: 'constructor/', children: gettext('Конструктор') },
];

function Header(): ReactElement {
	const location = useLocation();
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	return (
		<Nav variant='pills' className='nav-fill bg-light border rounded gap-2 p-2'>
			{headerLinks.map(({ className, ...props }, index) => {
				const to: string = `/telegram-bot-menu/${telegramBot.id}/${props.to}`;

				return (
					<Link
						key={index}
						{...props}
						to={to}
						className={
							classNames(
								'nav-link',
								{ active:  location.pathname === to },
								className,
							)
						}
					/>
				);
			})}
		</Nav>
	);
}

export default Header;