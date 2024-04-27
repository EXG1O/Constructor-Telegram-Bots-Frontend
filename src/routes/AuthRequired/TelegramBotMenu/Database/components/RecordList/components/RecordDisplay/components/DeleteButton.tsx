import React, { ReactElement, memo, useState, useCallback } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import AskConfirmModal, { AskConfirmModalProps } from 'components/AskConfirmModal';

import useToast from 'services/hooks/useToast';
import useRecords from '../../../../../hooks/useRecords';

import { LoaderData as TelegramBotMenuRootLoaderData } from '../../../../../../Root';

import { DatabaseRecordAPI } from 'services/api/telegram_bots/main';
import { DatabaseRecord } from 'services/api/telegram_bots/types';

export interface DeleteButtonProps extends Omit<ButtonProps, 'as' | 'size' | 'variant'> {
	record: DatabaseRecord;
}

function DeleteButton({ record, className, style, onClick, ...props }: DeleteButtonProps): ReactElement<DeleteButtonProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();
	const { updateRecords } = useRecords();

	const [show, setShow] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const handleConfirm = useCallback<NonNullable<AskConfirmModalProps['onConfirm']>>(async () => {
		setLoading(true);

		const response = await DatabaseRecordAPI._delete(telegramBot.id, record.id);

		if (response.ok) {
			updateRecords();
			setShow(false);
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

		setLoading(false);
	}, []);

	function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		setShow(true);
		onClick?.(event);
	}

	return (
		<>
			<AskConfirmModal
				show={show}
				loading={loading}
				title={gettext('Удаление записи')}
				onConfirm={handleConfirm}
				onHide={useCallback(() => setShow(false), [])}
			>
				{gettext('Вы точно хотите удалить запись?')}
			</AskConfirmModal>
			<Button
				{...props}
				as='i'
				size='sm'
				variant='danger'
				className={classNames('d-flex justify-content-center align-items-center bi bi-trash p-0', className)}
				style={{ width: '25px', height: '25px', fontSize: '18px', ...style }}
				onClick={handleClick}
			/>
		</>
	);
}

export default memo(DeleteButton);