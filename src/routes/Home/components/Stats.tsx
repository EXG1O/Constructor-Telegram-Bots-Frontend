import React, { memo, ReactElement } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as HomeLoaderData } from '..';

import Stack from 'react-bootstrap/Stack';

import Block, { BlockProps } from 'components/Block';
import InfoArea from 'components/InfoArea';

export type StatsProps = Omit<BlockProps, 'variant' | 'gradient' | 'children'>;

function Stats({ className, ...props }: StatsProps): ReactElement<StatsProps> {
	const { stats } = useRouteLoaderData('home') as HomeLoaderData;

	return (
		<Block {...props} variant='primary' gradient>
			<h3 className='fw-semibold text-center mb-3'>{gettext('Статистика')}</h3>
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
		</Block>
	);
}

export default memo(Stats);
