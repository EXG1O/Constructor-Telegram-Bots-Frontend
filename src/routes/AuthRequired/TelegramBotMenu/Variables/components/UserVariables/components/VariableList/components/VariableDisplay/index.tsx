import React, {
	ReactElement,
	HTMLAttributes,
	CSSProperties,
	memo,
	useCallback,
} from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import ClipboardIcon from 'assets/icons/clipboard.svg';
import TrashIcon from 'assets/icons/trash.svg';

import EditButton from './components/EditButton';

import { createMessageToast } from 'components/ToastContainer';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';

import useVariables from '../../../../hooks/useVariables';
import useVariable from '../../hooks/useVariables';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { VariableAPI } from 'services/api/telegram_bots/main';

export type VariableDisplayProps = Omit<
	HTMLAttributes<HTMLTableRowElement>,
	'children'
>;

const iconStyle: CSSProperties = { cursor: 'pointer' };

function VariableDisplay(
	props: VariableDisplayProps,
): ReactElement<VariableDisplayProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const { updateVariables } = useVariables();
	const { variable } = useVariable();

	const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	const showDeleteModal = useCallback(
		() =>
			setShowAskConfirmModal({
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

	return (
		<tr {...props}>
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
						<EditButton className='my-auto' />
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

export default memo(VariableDisplay);
