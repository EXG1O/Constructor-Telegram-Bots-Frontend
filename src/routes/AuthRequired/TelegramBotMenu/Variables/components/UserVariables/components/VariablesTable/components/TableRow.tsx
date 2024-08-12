import React, { CSSProperties, memo, ReactElement, useCallback } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ToastContainer';

import useVariables from '../../../hooks/useVariables';
import useVariableModalStore from '../../VariableModal/hooks/useVariableModalStore';

import ClipboardIcon from 'assets/icons/clipboard.svg';
import PencilSquareIcon from 'assets/icons/pencil-square.svg';
import TrashIcon from 'assets/icons/trash.svg';

import { VariableAPI } from 'services/api/telegram_bots/main';
import { Variable } from 'services/api/telegram_bots/types';

export interface TableRowProps {
	variable: Variable;
}

const iconStyle: CSSProperties = { cursor: 'pointer' };

function TableRow({ variable }: TableRowProps): ReactElement<TableRowProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const { updateVariables } = useVariables();

	const showAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	const showDeleteModal = useCallback(
		() =>
			showAskConfirmModal({
				title: gettext('Удаление переменной'),
				text: gettext('Вы точно хотите удалить переменную?'),
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await VariableAPI._delete(
						telegramBot.id,
						variable.id,
					);

					if (response.ok) {
						updateVariables();
						hideAskConfirmModal();
						createMessageToast({
							message: gettext('Вы успешно удалили переменную.'),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: gettext('Не удалось удалить переменную.'),
							level: 'error',
						});
					}

					setLoadingAskConfirmModal(false);
				},
				onCancel: null,
			}),
		[],
	);

	const showEditModal = useVariableModalStore((state) => state.showEdit);

	return (
		<tr>
			<td className='w-50'>
				<div className='d-flex align-items-center gap-2'>
					<ClipboardIcon
						className='btn-clipboard'
						data-clipboard-text={`{{ ${variable.name} }}`}
						style={iconStyle}
					/>
					<span className='flex-fill text-info-emphasis'>
						{variable.name}
					</span>
				</div>
			</td>
			<td>
				<div className='d-flex gap-2'>
					<span className='flex-fill text-nowrap'>
						{variable.description}
					</span>
					<div className='d-flex align-content-center gap-1'>
						<PencilSquareIcon
							width={18}
							height='100%'
							className='text-secondary'
							style={iconStyle}
							onClick={() => showEditModal(variable.id)}
						/>
						<TrashIcon
							width={18}
							height='100%'
							className='text-danger'
							style={iconStyle}
							onClick={showDeleteModal}
						/>
					</div>
				</div>
			</td>
		</tr>
	);
}

export default memo(TableRow);
