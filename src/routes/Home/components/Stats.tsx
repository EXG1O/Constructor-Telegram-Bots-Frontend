import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as HomeLoaderData } from '..';

import Stack from 'react-bootstrap/Stack';

import Block, { BlockProps } from 'components/Block';
import InfoArea from 'components/InfoArea';

export type StatsProps = Omit<BlockProps, 'variant' | 'gradient' | 'children'>;

function Stats({ className, ...props }: StatsProps): ReactElement<StatsProps> {
	const { t } = useTranslation('home', { keyPrefix: 'stats' });

	const { stats } = useRouteLoaderData('home') as HomeLoaderData;

	return (
		<Block {...props} variant='primary' gradient>
			<h3 className='fw-semibold text-center mb-3'>{t('title')}</h3>
			<Stack gap={2}>
				<InfoArea number={stats.users.total} description={t('usersTotal')} />
				<InfoArea
					number={stats.telegramBots.telegram_bots.total}
					description={t('telegramBotsTotal')}
				/>
				<InfoArea
					number={stats.telegramBots.telegram_bots.enabled}
					description={t('telegramBotsEnabled')}
				/>
				<InfoArea
					number={stats.telegramBots.users.total}
					description={t('telegramBotsUsers')}
				/>
			</Stack>
		</Block>
	);
}

export default memo(Stats);
