import React, { ReactElement, useEffect } from 'react';
import { Params } from 'react-router-dom';
import ClipboardJS from 'clipboard';

import Title from 'components/Title';

import SystemVariables from './components/SystemVariables';
import UserVariables from './components/UserVariables';

import useToast from 'services/hooks/useToast';

import { VariablesAPI } from 'services/api/telegram_bots/main';
import { APIResponse } from 'services/api/telegram_bots/types';

export interface PaginationData extends APIResponse.VariablesAPI.Get.Pagination {
	limit: number;
	offset: number;
	search: string;
}

export interface LoaderData {
	paginationData: PaginationData;
}

export async function loader({ params }: { params: Params<'telegramBotID'> }): Promise<LoaderData | Response> {
	const telegramBotID: number = parseInt(params.telegramBotID!);
	const [limit, offset] = [10, 0];

	const response = await VariablesAPI.get(telegramBotID, limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data!');
	}

	return { paginationData: { ...response.json, limit, offset, search: '' } };
}

function Variables(): ReactElement {
	const { createMessageToast } = useToast();

	useEffect(() => {
		const clipboard = new ClipboardJS('.btn-clipboard');

		clipboard.on('success', () => createMessageToast({
			message: gettext('Вы успешно скопировали переменную в буфер обмена.'),
			level: 'success',
		}));
		clipboard.on('error', () => createMessageToast({
			message: gettext('При попытки скопировать переменную в буфер обмена, непредвиденная ошибка!'),
			level: 'error',
		}));
	}, []);

	return (
		<Title title={gettext('Переменные')}>
			<SystemVariables />
			<UserVariables />
		</Title>
	);
}

export default Variables;