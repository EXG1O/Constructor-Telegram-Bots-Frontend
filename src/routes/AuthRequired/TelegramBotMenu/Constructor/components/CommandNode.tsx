import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, NodeProps, Position, useStore } from 'reactflow';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import './CommandNode.scss';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import Stack from 'components/Stack';
import { createMessageToast } from 'components/ToastContainer';

import NodeToolbar from './NodeToolbar';

import useCommandOffcanvasStore from './CommandOffcanvas/hooks/useCommandOffcanvasStore';

import { CommandAPI } from 'services/api/telegram_bots/main';
import { DiagramBlock, DiagramCommand } from 'services/api/telegram_bots/types';

type Data = Omit<DiagramCommand, keyof DiagramBlock>;

export type CommandNodeProps = NodeProps<Data>;

function CommandNode({ id, data }: CommandNodeProps): ReactElement<CommandNodeProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'nodes.command',
	});

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const onNodesChange = useStore((state) => state.onNodesChange);

	const showEditCommandOffcanvas = useCommandOffcanvasStore(
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

					const response = await CommandAPI.delete(telegramBot.id, data.id);

					if (response.ok) {
						onNodesChange?.([{ id, type: 'remove' }]);
						hideAskConfirmModal();
						createMessageToast({
							message: t('messages.deleteCommand.success'),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: t('messages.deleteCommand.error'),
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
				onEdit={useCallback(() => showEditCommandOffcanvas(data.id), [data.id])}
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
				<div
					className='message-text-block bg-white border rounded px-3 py-2'
					dangerouslySetInnerHTML={{ __html: data.message.text }}
				/>
				{data.keyboard?.buttons && (
					<Stack gap={1}>
						{data.keyboard.buttons.map((button) => (
							<div
								key={button.id}
								className='text-bg-dark rounded text-center text-break px-3 py-2'
								style={{ position: 'relative' }}
							>
								<Handle
									id={`${id}:left:${button.id}`}
									type='source'
									position={Position.Left}
								/>
								{button.text}
								<Handle
									id={`${id}:right:${button.id}`}
									type='source'
									position={Position.Right}
								/>
							</div>
						))}
					</Stack>
				)}
			</Stack>
		</>
	);
}

export default memo(CommandNode);
