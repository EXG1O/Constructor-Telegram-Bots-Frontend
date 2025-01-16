import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Page from 'components/Page';
import TelegramBotBlock from 'components/TelegramBotBlock';

import TelegramBotBlockFooter from './components/TelegramBotBlockFooter';

function Index(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenu);

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

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
