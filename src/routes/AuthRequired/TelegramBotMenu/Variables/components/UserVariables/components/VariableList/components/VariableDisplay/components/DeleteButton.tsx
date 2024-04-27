import React, { ReactElement, HTMLAttributes, memo, useState, useCallback } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import AskConfirmModal  from 'components/AskConfirmModal';

import useToast from 'services/hooks/useToast';
import useVariables from '../../../../../hooks/useVariables';
import useVariable from '../../../hooks/useVariables';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { VariableAPI } from 'services/api/telegram_bots/main';

export type DeleteButtonProps = Omit<HTMLAttributes<HTMLElement>, 'children'>;

function DeleteButton({ className, style, onClick, ...props }: DeleteButtonProps): ReactElement<DeleteButtonProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();
	const { updateVariables } = useVariables();
	const { variable } = useVariable();

	const [showModal, setShowModal] = useState<boolean>(false);
	const [loadingModal, setLoadingModal] = useState<boolean>(false);

	const handleConfirm = useCallback(async () => {
		setLoadingModal(true);

		const response = await VariableAPI._delete(telegramBot.id, variable.id);

		if (response.ok) {
			updateVariables();
			setShowModal(false);
			createMessageToast({
				message: gettext('Вы успешно удалили переменную.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось удалить переменную!'),
				level: 'error',
			});
		}

		setLoadingModal(false);
	}, []);

	function handleClick(event: React.MouseEvent<HTMLElement>): void {
		setShowModal(true);
		onClick?.(event);
	}

	return (
		<>
			<AskConfirmModal
				show={showModal}
				loading={loadingModal}
				title={gettext('Удаление переменной')}
				onConfirm={handleConfirm}
				onHide={useCallback(() => setShowModal(false), [])}
			>
				{gettext('Вы точно хотите удалить переменную?')}
			</AskConfirmModal>
			<i
				{...props}
				className={classNames('d-flex text-danger bi bi-trash', className)}
				style={{ fontSize: '18px', cursor: 'pointer', ...style }}
				onClick={handleClick}
			/>
		</>
	);
}

export default memo(DeleteButton);