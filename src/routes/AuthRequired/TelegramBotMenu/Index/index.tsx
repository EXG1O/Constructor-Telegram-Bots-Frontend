import React, { ReactElement } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Page from 'components/Page';
import TelegramBotCard from 'components/TelegramBotCard';

import TelegramBotCardFooter from './components/TelegramBotCardFooter';

function Index(): ReactElement {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	return (
		<Page title={gettext('Telegram бот')} grid>
			<Row className='g-3 g-lg-4'>
				<Col xs={12} lg={6}>
					<TelegramBotCard telegramBot={telegramBot}>
						<TelegramBotCardFooter />
					</TelegramBotCard>
				</Col>
			</Row>
		</Page>
	);
}

export default Index;
