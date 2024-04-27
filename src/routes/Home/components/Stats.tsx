import React, { ReactElement } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import './Stats.scss';

import Stack from 'react-bootstrap/Stack';

import InfoArea from 'components/InfoArea';

import { LoaderData as HomeLoaderData } from '..';

function Stats(): ReactElement {
	const { stats } = useRouteLoaderData('home') as HomeLoaderData;

	return (
		<div className='stats'>
			<h3>{gettext('Информация о сайте')}</h3>
			<Stack gap={1}>
				<InfoArea
					value={stats.users.total}
					description={gettext('Пользователей')}
				/>
				<InfoArea
					value={stats.telegramBots.telegram_bots.total}
					description={gettext('Добавленных Telegram ботов')}
				/>
				<InfoArea
					value={stats.telegramBots.telegram_bots.enabled}
					description={gettext('Включенных Telegram ботов')}
				/>
				<InfoArea
					value={stats.telegramBots.users.total}
					description={gettext('Пользователей Telegram ботов')}
				/>
			</Stack>
		</div>
	);
}

export default Stats;