import React, { ReactElement, useMemo } from 'react';

import classNames from 'classnames/bind';

import CardHeader, { CardHeaderProps } from 'react-bootstrap/CardHeader';

import Loading from 'components/Loading';

import useTelegramBot from '../hooks/useTelegramBot';

export type HeaderProps = Omit<CardHeaderProps, 'children'>;

function Header({ className, ...props }: HeaderProps): ReactElement<HeaderProps> {
	const [telegramBot] = useTelegramBot();

	const cx = useMemo(
		() =>
			classNames.bind({
				base: 'fw-semibold text-center',
				loading:
					'd-flex justify-content-center text-bg-secondary border-secondary',
				enable: 'text-bg-success border-success',
				disable: 'text-bg-danger border-danger',
				extra: className ?? '',
			}),
		[className],
	);

	return (
		<CardHeader
			as='h5'
			{...props}
			{...(telegramBot.is_loading
				? {
						className: cx('loading'),
						children: <Loading size='xs' />,
					}
				: telegramBot.is_enabled
					? {
							className: cx('base', 'enable', 'extra'),
							children: gettext('Telegram бот включен'),
						}
					: {
							className: cx('base', 'disable', 'extra'),
							children: gettext('Telegram бот выключен'),
						})}
		/>
	);
}

export default Header;
