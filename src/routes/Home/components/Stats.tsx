import React, { ReactElement, HTMLAttributes, memo } from 'react';

import classNames from 'classnames';
import { useRouteLoaderData } from 'react-router-dom';

import Stack from 'react-bootstrap/Stack';

import InfoArea from 'components/InfoArea';

import { LoaderData as HomeLoaderData } from '..';

export type StatsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Stats({ className, ...props }: StatsProps): ReactElement<StatsProps> {
	const { stats } = useRouteLoaderData('home') as HomeLoaderData;

	return (
		<div
			{...props}
			className={classNames(
				'text-center text-bg-primary bg-gradient rounded-4 p-3',
				className,
			)}
		>
			<h3 className='fw-semibold mb-3'>{gettext('Статистика')}</h3>
			<Stack gap={2}>
				<InfoArea
					number={stats.users.total}
					description={gettext('Пользователей')}
				/>
				<InfoArea
					number={stats.telegramBots.telegram_bots.total}
					description={gettext('Добавленных Telegram ботов')}
				/>
				<InfoArea
					number={stats.telegramBots.telegram_bots.enabled}
					description={gettext('Включенных Telegram ботов')}
				/>
				<InfoArea
					number={stats.telegramBots.users.total}
					description={gettext('Пользователей Telegram ботов')}
				/>
			</Stack>
		</div>
	);
}

export default memo(Stats);
