import React, {
	ReactElement,
	HTMLAttributes,
	CSSProperties,
	memo,
	useCallback,
} from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import EditButton from './components/EditButton';

import useToast from 'services/hooks/useToast';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';

import useVariables from '../../../../hooks/useVariables';
import useVariable from '../../hooks/useVariables';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { VariableAPI } from 'services/api/telegram_bots/main';

export type VariableDisplayProps = Omit<
	HTMLAttributes<HTMLTableRowElement>,
	'children'
>;

const deleteButtonStyle: CSSProperties = {
	fontSize: '18px',
	cursor: 'pointer',
	marginLeft: '5.5px',
};

function VariableDisplay(
	props: VariableDisplayProps,
): ReactElement<VariableDisplayProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();

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
				<div className='d-flex gap-2'>
					<i
						className='btn-clipboard bi bi-clipboard'
						data-clipboard-text={`{{ ${variable.name} }}`}
						style={{ cursor: 'pointer' }}
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
					<div className='d-flex'>
						<EditButton className='my-auto' />
						<i
							className='d-flex text-danger bi bi-trash my-auto'
							style={deleteButtonStyle}
							onClick={showDeleteModal}
						/>
					</div>
				</div>
			</td>
		</tr>
	);
}

export default memo(VariableDisplay);
