import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from 'react-bootstrap';

import Block from 'components/Block';
import Page from 'components/Page';

import Toolbar from './components/Toolbar';
import UsersTable from './components/UsersTable';
import StoreProvider from './providers/StoreProvider';

function Users(): ReactElement {
	const { t, i18n } = useTranslation('telegram-bot-menu-users');

	const title = useMemo<string>(() => t('title'), [i18n.language]);

	return (
		<Page title={title} grid>
			<StoreProvider>
				<Block variant='light'>
					<h3 className='fw-semibold text-center mb-3'>{title}</h3>
					<Stack gap={2}>
						<Toolbar />
						<UsersTable />
					</Stack>
				</Block>
			</StoreProvider>
		</Page>
	);
}

export default Users;
