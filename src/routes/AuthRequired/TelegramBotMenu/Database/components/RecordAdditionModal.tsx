import React, { ReactElement, memo, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import RecordFormModal, { RecordFormModalProps, Value, defaultValue } from './RecordFormModal';

import useToast from 'services/hooks/useToast';
import useRecords from '../hooks/useRecords';

import { LoaderData as TelegramBotMenuRootLoaderData } from '../../Root';

import { DatabaseRecordAPI } from 'services/api/telegram_bots/main';

export type RecordAdditionModalProps = Omit<RecordFormModalProps, 'loading' | 'value' | 'title' | 'onChange' | 'children'>;

function RecordAdditionModal({ onHide, onExited, ...props }: RecordAdditionModalProps): ReactElement<RecordAdditionModalProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();
	const { updateRecords } = useRecords();

	const [value, setValue] = useState<Value>(defaultValue);
	const [loading, setLoading] = useState<boolean>(false);

	function handleExited(node: HTMLElement): void {
		onExited?.(node);
		setValue(defaultValue);
	}

	async function handleClick(): Promise<void> {
		setLoading(true);

		try {
			const data: Record<string, any> = JSON.parse(value);

			const response = await DatabaseRecordAPI.create(telegramBot.id, { data });

			if (response.ok) {
				updateRecords();
				onHide();
				createMessageToast({
					message: gettext('Вы успешно добавили запись.'),
					level: 'success',
				});
			} else {
				createMessageToast({
					message: gettext('Не удалось добавить запись!'),
					level: 'error',
				});
			}
		} catch (error) {
			if (error instanceof SyntaxError) {
				createMessageToast({
					message: gettext('Введите правильно данные в формате JSON!'),
					level: 'error',
				});
			} else {
				createMessageToast({
					message: gettext('Произошла непредвиденная ошибка!'),
					level: 'error',
				});
			}
		}

		setLoading(false);
	}

	return (
		<RecordFormModal
			{...props}
			value={value}
			loading={loading}
			title={gettext('Добавление записи')}
			onChange={setValue}
			onHide={onHide}
			onExited={handleExited}
		>
			<RecordFormModal.Footer>
				<Button
					variant='success'
					onClick={handleClick}
				>
					{gettext('Добавить')}
				</Button>
			</RecordFormModal.Footer>
		</RecordFormModal>
	);
}

export default memo(RecordAdditionModal);