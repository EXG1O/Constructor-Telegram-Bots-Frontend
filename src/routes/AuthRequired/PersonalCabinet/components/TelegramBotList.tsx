import React, { ReactElement, memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Row, { RowProps } from 'react-bootstrap/Row';

import TelegramBotCard from 'components/TelegramBotCard';

import useTelegramBots from '../services/hooks/useTelegramBots';

export type TelegramBotListProps = Omit<RowProps, 'children'>;

function TelegramBotList({ className, ...props }: TelegramBotListProps): ReactElement<TelegramBotListProps> {
	const [telegramBots] = useTelegramBots();

	return (
		<Row xs={1} md={2} xl={3} {...props} className={classNames('g-3', className)}>
			{telegramBots.length ? (
				telegramBots.map(telegramBot => (
					<TelegramBotCard key={telegramBot.id} telegramBot={telegramBot}>
						{() => (
							<Link
								to={`/telegram-bot-menu/${telegramBot.id}/`}
								className='card-footer btn btn-light border border-top-0'
							>
								{gettext('Меню Telegram бота')}
							</Link>
						)}
					</TelegramBotCard>
				))
			) : (
				<div className='border rounded text-center px-3 py-2'>
					{gettext('Вы ещё не добавили Telegram бота')}
				</div>
			)}
		</Row>
	);
}

export default memo(TelegramBotList);