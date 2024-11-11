import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { reverse, RouteID } from 'routes';

import Row, { RowProps } from 'react-bootstrap/Row';

import TelegramBotBlock from 'components/TelegramBotBlock';

import useTelegramBots from '../hooks/useTelegramBots';

export type TelegramBotListProps = Omit<RowProps, 'children'>;

function TelegramBotList({
	className,
	...props
}: TelegramBotListProps): ReactElement<TelegramBotListProps> {
	const { t } = useTranslation(RouteID.TelegramBots);

	const [telegramBots] = useTelegramBots();

	return (
		<Row xs={1} md={2} xl={3} {...props} className={classNames('g-3', className)}>
			{telegramBots.length ? (
				telegramBots.map((telegramBot) => (
					<TelegramBotBlock key={telegramBot.id} telegramBot={telegramBot}>
						<Link
							to={reverse(RouteID.TelegramBotMenu, {
								telegramBotID: telegramBot.id,
							})}
							className='btn btn-dark'
						>
							{t('telegramBotMenuLink')}
						</Link>
					</TelegramBotBlock>
				))
			) : (
				<div className='border rounded text-center px-3 py-2'>
					{t('notTelegramBots')}
				</div>
			)}
		</Row>
	);
}

export default memo(TelegramBotList);
