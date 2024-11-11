import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Page from 'components/Page';

import Donations from './components/Donations';
import Header from './components/Header';
import Stats from './components/Stats';

function Home(): ReactElement {
	const { t } = useTranslation(RouteID.Home);

	return (
		<Page title={t('title')} align='center'>
			<Row className='g-3 g-lg-4'>
				<Col xs={12}>
					<Header />
				</Col>
				<Col xs={12} lg={6}>
					<Stats />
				</Col>
				<Col xs={12} lg={6}>
					<Donations />
				</Col>
			</Row>
		</Page>
	);
}

export default Home;
