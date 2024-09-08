import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Params } from 'react-router-dom';
import ClipboardJS from 'clipboard';

import Page from 'components/Page';
import { createMessageToast } from 'components/ToastContainer';

import SystemVariables from './components/SystemVariables';
import UserVariables from './components/UserVariables';

import { VariablesAPI } from 'services/api/telegram_bots/main';
import { APIResponse } from 'services/api/telegram_bots/types';

export interface PaginationData extends APIResponse.VariablesAPI.Get.Pagination {
	limit: number;
	offset: number;
}

export interface LoaderData {
	paginationData: PaginationData;
}

export async function loader({
	params,
}: {
	params: Params<'telegramBotID'>;
}): Promise<LoaderData | Response> {
	const telegramBotID: number = parseInt(params.telegramBotID!);
	const [limit, offset] = [10, 0];

	const response = await VariablesAPI.get(telegramBotID, limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data.');
	}

	return { paginationData: { ...response.json, limit, offset } };
}

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
