import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, NodeProps, Position, useStore } from 'reactflow';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Stack from 'react-bootstrap/Stack';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ToastContainer';

import NodeToolbar from './NodeToolbar';

import useConditionOffcanvasStore from './ConditionOffcanvas/hooks/useConditionOffcanvasStore';

import { ConditionAPI } from 'services/api/telegram_bots/main';
import { DiagramBlock, DiagramCommand } from 'services/api/telegram_bots/types';

type Data = Omit<DiagramCommand, keyof DiagramBlock>;

export type ConditionNodeProps = NodeProps<Data>;

function ConditionNode({
	id,
	data,
}: ConditionNodeProps): ReactElement<ConditionNodeProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'nodes.condition',
	});

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const onNodesChange = useStore((state) => state.onNodesChange);

	const showEditConditionOffcanvas = useConditionOffcanvasStore(
		(state) => state.showEdit,
	);

	const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	const showDeleteModal = useCallback(
		() =>
			setShowAskConfirmModal({
				title: t('deleteModal.title'),
				text: t('deleteModal.text'),
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await ConditionAPI.delete(telegramBot.id, data.id);

					if (response.ok) {
						onNodesChange?.([{ id, type: 'remove' }]);
						hideAskConfirmModal();
						createMessageToast({
							message: t('messages.deleteCondition.success'),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: t('messages.deleteCondition.error'),
							level: 'error',
						});
					}

					setLoadingAskConfirmModal(false);
				},
				onCancel: null,
			}),
		[i18n.language],
	);

	return (
		<>
			<NodeToolbar
				title={t('title')}
				onEdit={useCallback(
					() => showEditConditionOffcanvas(data.id),
					[data.id],
				)}
				onDelete={showDeleteModal}
			/>
			<Stack gap={2} style={{ width: '300px' }}>
				<div
					className='bg-white border rounded text-center text-break px-3 py-2'
					style={{ position: 'relative' }}
				>
					<Handle
						id={`${id}:left:0`}
						type='target'
						position={Position.Left}
					/>
					{data.name}
					<Handle
						id={`${id}:right:0`}
						type='target'
						position={Position.Right}
					/>
				</div>
			</Stack>
		</>
	);
}

export default memo(ConditionNode);
