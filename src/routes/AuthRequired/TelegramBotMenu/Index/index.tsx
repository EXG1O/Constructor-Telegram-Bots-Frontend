import React, { ReactElement } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Title from 'components/Title';
import TelegramBotCard from 'components/TelegramBotCard';

import TelegramBotCardFooter from './components/TelegramBotCardFooter';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

function Index(): ReactElement {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	return (
		<Title title={gettext('Telegram бот')}>
			<Row className='g-3 g-lg-4'>
				<Col xs={12} lg={6}>
					<TelegramBotCard telegramBot={telegramBot}>
						{props => (
							<TelegramBotCardFooter {...props} />
						)}
					</TelegramBotCard>
				</Col>
			</Row>
		</Title>
	);
}

export default Index;