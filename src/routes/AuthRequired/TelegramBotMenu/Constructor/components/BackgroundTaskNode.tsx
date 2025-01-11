import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, NodeProps, Position, useStore } from 'reactflow';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import Stack from 'components/Stack';
import { createMessageToast } from 'components/ToastContainer';

import { useBackgroundTaskOffcanvasStore } from './BackgroundTaskOffcanvas/store';
import NodeToolbar from './NodeToolbar';

import { BackgroundTaskAPI } from 'services/api/telegram_bots/main';
import { DiagramBackgroundTask, DiagramBlock } from 'services/api/telegram_bots/types';

type Data = Omit<DiagramBackgroundTask, keyof DiagramBlock>;

export type BackgroundTaskNodeProps = NodeProps<Data>;

const nodePrefix: string = 'nodes.backgroundTask';
const offcanvasPrefix: string = 'backgroundTaskOffcanvas';

function BackgroundTaskNode({
	id,
	data: task,
}: BackgroundTaskNodeProps): ReactElement<BackgroundTaskNodeProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor);

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const onNodesChange = useStore((state) => state.onNodesChange);

	const showEditBackgroundTaskOffcanvas = useBackgroundTaskOffcanvasStore(
		(state) => state.showOffcanvas,
	);

	const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	const showDeleteModal = useCallback(
		() =>
			setShowAskConfirmModal({
				title: t(`${nodePrefix}.deleteModal.title`),
				text: t(`${nodePrefix}.deleteModal.text`),
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await BackgroundTaskAPI.delete(
						telegramBot.id,
						task.id,
					);

					if (response.ok) {
						onNodesChange?.([{ id, type: 'remove' }]);
						hideAskConfirmModal();
						createMessageToast({
							message: t(
								`${nodePrefix}.messages.deleteBackgroundTask.success`,
							),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: t(
								`${nodePrefix}.messages.deleteBackgroundTask.error`,
							),
							level: 'error',
						});
					}

					setLoadingAskConfirmModal(false);
				},
				onCancel: null,
			}),
		[i18n.language],
	);

	const handleEdit = useCallback(
		() => showEditBackgroundTaskOffcanvas(task.id),
		[task.id],
	);

	return (
		<>
			<NodeToolbar
				title={t(`${nodePrefix}.title`)}
				onEdit={handleEdit}
				onDelete={showDeleteModal}
			/>
			<Stack gap={2} style={{ width: '300px' }}>
				<div
					className='bg-white border rounded text-center text-break px-3 py-2'
					style={{ position: 'relative' }}
				>
					<Handle
						id={`${id}:left:0`}
						type='source'
						position={Position.Left}
					/>
					{task.name}
					<Handle
						id={`${id}:right:0`}
						type='source'
						position={Position.Right}
					/>
				</div>
				<div className='bg-white border rounded px-3 py-2'>
					<strong>{`${t(`${nodePrefix}.interval`)}:`}</strong>{' '}
					{t(`${offcanvasPrefix}.intervalBlock.select.${task.interval}`)}
				</div>
			</Stack>
		</>
	);
}

export default memo(BackgroundTaskNode);
