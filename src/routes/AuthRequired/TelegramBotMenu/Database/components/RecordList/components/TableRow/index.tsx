import React, {
	CSSProperties,
	ReactElement,
	useCallback,
	useMemo,
	useState,
} from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import Button from 'react-bootstrap/Button';
import ListGroupItem, { ListGroupItemProps } from 'react-bootstrap/ListGroupItem';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import Loading from 'components/Loading';
import MonacoEditor, { MonacoEditorProps } from 'components/MonacoEditor';
import { createMessageToast } from 'components/ToastContainer';

import ConfirmButtonGroup, {
	ConfirmButtonGroupProps,
} from './components/ConfirmButtonGroup';

import { LoaderData as TelegramBotMenuRootLoaderData } from '../../../../../Root';
import Wrapper from '../Wrapper';

import useDatabaseRecordsStore from '../../../../hooks/useDatabaseRecordsStore';

import TrashIcon from 'assets/icons/trash.svg';

import { DatabaseRecordAPI } from 'services/api/telegram_bots/main';
import { DatabaseRecord } from 'services/api/telegram_bots/types';

export interface TableRowProps extends Omit<ListGroupItemProps, 'children'> {
	record: DatabaseRecord;
}

const deleteButtonStyle: CSSProperties = {
	width: '25px',
	height: '25px',
};

function TableRow({
	record,
	className,
	...props
}: TableRowProps): ReactElement<TableRowProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

	const initialValue = useMemo<string>(
		() => JSON.stringify(record.data, undefined, 4),
		[],
	);
	const options = useMemo<NonNullable<MonacoEditorProps['options']>>(
		() => ({
			glyphMargin: false,
			folding: false,
			lineNumbers: 'off',
			lineDecorationsWidth: 0,
			lineNumbersMinChars: 0,
		}),
		[],
	);

	const [value, setValue] = useState<string>(initialValue);
	const [loading, setLoading] = useState<boolean>(false);

	const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	const showDeleteModal = useCallback(
		() =>
			setShowAskConfirmModal({
				title: gettext('Удаление записи'),
				text: gettext('Вы точно хотите удалить запись?'),
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await DatabaseRecordAPI._delete(
						telegramBot.id,
						record.id,
					);

					if (response.ok) {
						updateRecords();
						hideAskConfirmModal();
						createMessageToast({
							message: gettext('Вы успешно удалили запись.'),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: gettext('Не удалось удалить запись!'),
							level: 'error',
						});
					}

					setLoadingAskConfirmModal(false);
				},
				onCancel: null,
			}),
		[],
	);

	const handleChange = useCallback<NonNullable<MonacoEditorProps['onChange']>>(
		(editor, newValue) => {
			if (initialValue === value && value !== newValue) {
				editor.updateLayout(true);
			}

			setValue(newValue);
		},
		[value],
	);

	const handleConfirm = useCallback<
		NonNullable<ConfirmButtonGroupProps['onConfirm']>
	>(async () => {
		setLoading(true);

		try {
			const data: Record<string, any> = JSON.parse(value);

			const response = await DatabaseRecordAPI.partialUpdate(
				telegramBot.id,
				record.id,
				{ data },
			);

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

	const handleCancel = useCallback<NonNullable<ConfirmButtonGroupProps['onCancel']>>(
		() => setValue(initialValue),
		[initialValue],
	);

	return !loading ? (
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
				<Button
					size='sm'
					variant='danger'
					className='d-flex justify-content-center align-items-center p-0'
					style={deleteButtonStyle}
					onClick={showDeleteModal}
				>
					<TrashIcon width={18} height={18} />
				</Button>
			</div>
		</ListGroupItem>
	) : (
		<Wrapper className='d-flex justify-content-center p-3'>
			<Loading size='sm' />
		</Wrapper>
	);
}

export default TableRow;
