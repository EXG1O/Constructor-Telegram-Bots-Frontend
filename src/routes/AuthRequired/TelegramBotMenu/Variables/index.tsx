import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ClipboardJS from 'clipboard';

import Page from 'components/Page';
import { createMessageToast } from 'components/ToastContainer';

import SystemVariables from './components/SystemVariables';
import UserVariables from './components/UserVariables';

function Variables(): ReactElement {
	const { t } = useTranslation('telegram-bot-menu-variables');

	useEffect(() => {
		const clipboard = new ClipboardJS('.btn-clipboard');

		clipboard.on('success', () =>
			createMessageToast({
				message: t('messages.copy.success'),
				level: 'success',
			}),
		);
		clipboard.on('error', () =>
			createMessageToast({
				message: t('messages.copy.error'),
				level: 'error',
			}),
		);
	}, []);

	return (
		<Page title={t('title')} grid>
			<SystemVariables />
			<UserVariables.StoreProvider>
				<UserVariables />
			</UserVariables.StoreProvider>
		</Page>
	);
}

export default Variables;
