import React, { CSSProperties, memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ToastContainer';

import { useVariableModalStore } from '../../VariableModal/store';

import useUserVariablesStore from '../../../hooks/useUserVariablesStore';

import ClipboardIcon from 'assets/icons/clipboard.svg';
import PencilSquareIcon from 'assets/icons/pencil-square.svg';
import TrashIcon from 'assets/icons/trash.svg';

import { VariableAPI } from 'api/telegram_bots/main';
import { Variable } from 'api/telegram_bots/types';

export interface TableRowProps {
	variable: Variable;
}

const iconStyle: CSSProperties = { cursor: 'pointer' };

function TableRow({ variable }: TableRowProps): ReactElement<TableRowProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'user.table.row',
	});

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const updateVariables = useUserVariablesStore((state) => state.updateVariables);

	const showAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	const showDeleteModal = useCallback(
		() =>
			showAskConfirmModal({
				title: t('deleteModal.title'),
				text: t('deleteModal.text'),
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await VariableAPI.delete(
						telegramBot.id,
						variable.id,
					);

					if (response.ok) {
						updateVariables();
						hideAskConfirmModal();
						createMessageToast({
							message: t('messages.deleteVariable.success'),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: t('messages.deleteVariable.error'),
							level: 'error',
						});
					}

					setLoadingAskConfirmModal(false);
				},
				onCancel: null,
			}),
		[],
	);

	const showVariableModal = useVariableModalStore((state) => state.showModal);

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
							onClick={() => showVariableModal(variable.id)}
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
