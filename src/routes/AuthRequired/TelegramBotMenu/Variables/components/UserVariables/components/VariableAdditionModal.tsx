import React, { ReactElement, memo, useState } from 'react';

import { useRouteLoaderData } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import { createMessageToast } from 'components/ToastContainer';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { VariablesAPI } from 'services/api/telegram_bots/main';

import useVariables from '../hooks/useVariables';

import VariableFormModal, {
	VariableFormModalProps,
	Data,
	defaultData,
} from './VariableFormModal';

export type VariableAdditionModalProps = Omit<
	VariableFormModalProps,
	'loading' | 'data' | 'title' | 'onChange' | 'children'
>;

function VariableAdditionModal({
	onHide,
	onExited,
	...props
}: VariableAdditionModalProps): ReactElement<VariableAdditionModalProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const { updateVariables } = useVariables();

	const [data, setData] = useState<Data>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);

	function handleExited(node: HTMLElement): void {
		setData(defaultData);
		onExited?.(node);
	}

	async function handleAddButtonClick(): Promise<void> {
		setLoading(true);

		const response = await VariablesAPI.create(telegramBot.id, data);

		if (response.ok) {
			updateVariables();
			onHide();
			createMessageToast({
				message: gettext('Вы успешно добавили переменную.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось добавить переменную!'),
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
			title={gettext('Добавление переменной')}
			onChange={setData}
			onHide={onHide}
			onExited={handleExited}
		>
			<VariableFormModal.Footer>
				<Button variant='success' onClick={handleAddButtonClick}>
					{gettext('Добавить')}
				</Button>
			</VariableFormModal.Footer>
		</VariableFormModal>
	);
}

export default memo(VariableAdditionModal);
