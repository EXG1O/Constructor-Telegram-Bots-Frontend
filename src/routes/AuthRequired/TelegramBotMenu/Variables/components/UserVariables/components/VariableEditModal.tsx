import React, { ReactElement, memo, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import VariableFormModal, { VariableFormModalProps, Data } from './VariableFormModal';

import useToast from 'services/hooks/useToast';
import useVariables from '../hooks/useVariables';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { VariableAPI } from 'services/api/telegram_bots/main';
import { Variable } from 'services/api/telegram_bots/types';

export interface VariableEditModalProps extends Omit<VariableFormModalProps, 'loading' | 'data' | 'title' | 'onChange' | 'children'> {
	variable: Variable;
}

function VariableEditModal({ variable, onHide, ...props }: VariableEditModalProps): ReactElement<VariableEditModalProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();
	const { updateVariables } = useVariables();

	const [data, setData] = useState<Data>(variable);
	const [loading, setLoading] = useState<boolean>(false);

	async function handleSaveButtonClick(): Promise<void> {
		setLoading(true);

		const response = await VariableAPI.update(telegramBot.id, variable.id, data);

		if (response.ok) {
			updateVariables();
			onHide();
			createMessageToast({
				message: gettext('Вы успешно сохранили переменную.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось сохранить переменную!'),
				level: 'error',
			});
		}

		setLoading(false);
	}

	return (
		<VariableFormModal
			{...props}
			loading={loading}
			data={data}
			title={gettext('Редактирование переменной')}
			onChange={setData}
			onHide={onHide}
		>
			<VariableFormModal.Footer>
				<Button
					variant='success'
					onClick={handleSaveButtonClick}
				>
					{gettext('Сохранить')}
				</Button>
			</VariableFormModal.Footer>
		</VariableFormModal>
	);
}

export default memo(VariableEditModal);