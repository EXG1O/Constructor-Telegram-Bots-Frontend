import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import ListGroupItem, { ListGroupItemProps } from 'react-bootstrap/ListGroupItem';

import Loading from 'components/Loading';
import MonacoEditor, { MonacoEditorProps } from 'components/MonacoEditor';

import Block from '../Block';
import ConfirmButtonGroup, { ConfirmButtonGroupProps } from './components/ConfirmButtonGroup';
import DeleteButton from './components/DeleteButton';

import useToast from 'services/hooks/useToast';
import useRecords from '../../../../hooks/useRecords';

import { LoaderData as TelegramBotMenuRootLoaderData } from '../../../../../Root';

import { DatabaseRecordAPI } from 'services/api/telegram_bots/main';
import { DatabaseRecord } from 'services/api/telegram_bots/types';

export interface RecordDisplayProps extends Omit<ListGroupItemProps, 'children'> {
	record: DatabaseRecord;
}

function RecordDisplay({ record, className, ...props }: RecordDisplayProps): ReactElement<RecordDisplayProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();
	const { updateRecords } = useRecords();

	const initialValue = useMemo<string>(() => JSON.stringify(record.data, undefined, 4), []);
	const options = useMemo<NonNullable<MonacoEditorProps['options']>>(() => ({
		glyphMargin: false,
		folding: false,
		lineNumbers: 'off',
		lineDecorationsWidth: 0,
		lineNumbersMinChars: 0,
	}), []);

	const [value, setValue] = useState<string>(initialValue);
	const [loading, setLoading] = useState<boolean>(false);

	const handleChange = useCallback<NonNullable<MonacoEditorProps['onChange']>>((editor, newValue) => {
		if (initialValue === value && value !== newValue) {
			editor.updateLayout(true);
		}

		setValue(newValue);
	}, []);

	const handleConfirm = useCallback<NonNullable<ConfirmButtonGroupProps['onConfirm']>>(async () => {
		setLoading(true);

		try {
			const data: Record<string, any> = JSON.parse(value);

			const response = await DatabaseRecordAPI.partialUpdate(telegramBot.id, record.id, { data });

			if (response.ok) {
				updateRecords();
				createMessageToast({
					message: gettext('Вы успешно обновили запись.'),
					level: 'success',
				});
			} else {
				createMessageToast({
					message: gettext('Не удалось обновить запись!'),
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
	}, [telegramBot, record, value]);

	const handleCancel = useCallback<NonNullable<ConfirmButtonGroupProps['onCancel']>>(() => setValue(initialValue), [initialValue]);

	return (
		!loading ? (
			<ListGroupItem {...props} className={classNames(className, 'd-flex gap-3')}>
				<MonacoEditor
					size='sm'
					value={value}
					language='json'
					options={options}
					onChange={handleChange}
				/>
				<div className='d-flex align-items-center gap-2'>
					{value !== initialValue && (
						<ConfirmButtonGroup
							onConfirm={handleConfirm}
							onCancel={handleCancel}
						/>
					)}
					<DeleteButton record={record} />
				</div>
			</ListGroupItem>
		) : (
			<Block className='d-flex justify-content-center p-3'>
				<Loading size='sm' />
			</Block>
		)
	);
}

export default RecordDisplay;