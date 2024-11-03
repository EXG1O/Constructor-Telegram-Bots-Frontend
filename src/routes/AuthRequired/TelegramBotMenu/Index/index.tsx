import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import useTelegramBotMenuRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRouteLoaderData';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Page from 'components/Page';
import TelegramBotBlock from 'components/TelegramBotBlock';

import TelegramBotBlockFooter from './components/TelegramBotBlockFooter';

function Index(): ReactElement {
	const { t } = useTranslation('telegram-bot-menu-index');

	const { telegramBot } = useTelegramBotMenuRouteLoaderData();

	return (
		<Page title={t('title')} grid>
			<Row className='g-3 g-lg-4'>
				<Col xs={12} lg={6}>
					<TelegramBotBlock telegramBot={telegramBot}>
						<TelegramBotBlockFooter />
					</TelegramBotBlock>
				</Col>
			</Row>
		</Page>
	);
}

export default Index;
