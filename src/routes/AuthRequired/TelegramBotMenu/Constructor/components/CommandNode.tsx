import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, NodeProps as RFNodeProps, Position, useStore } from 'reactflow';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import './CommandNode.scss';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import Stack from 'components/Stack';
import { createMessageToast } from 'components/ToastContainer';

import { useCommandOffcanvasStore } from './CommandOffcanvas/store';
import Node, { NodeProps } from './Node';

import { CommandAPI } from 'api/telegram_bots/main';
import { DiagramBlock, DiagramCommand } from 'api/telegram_bots/types';

type Data = Omit<DiagramCommand, keyof DiagramBlock>;

export type CommandNodeProps = RFNodeProps<Data>;

type EditHandler = NodeProps['onEdit'];

function CommandNode({
	id,
	data: command,
}: CommandNodeProps): ReactElement<CommandNodeProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'nodes.command',
	});

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const onNodesChange = useStore((state) => state.onNodesChange);

	const showEditCommandOffcanvas = useCommandOffcanvasStore(
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
				title: t('deleteModal.title'),
				text: t('deleteModal.text'),
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await CommandAPI.delete(
						telegramBot.id,
						command.id,
					);

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

	const handleEdit = useCallback<EditHandler>(
		() => showEditCommandOffcanvas(command.id),
		[command.id],
	);

	return (
		<Node title={t('title')} onEdit={handleEdit} onDelete={showDeleteModal}>
			<Node.Block className='position-relative text-center text-break'>
				<Handle id={`${id}:left:0`} type='target' position={Position.Left} />
				{command.name}
				<Handle id={`${id}:right:0`} type='target' position={Position.Right} />
			</Node.Block>
			<Node.Block
				className='message-text-block'
				dangerouslySetInnerHTML={{ __html: command.message.text }}
			/>
			{command.keyboard?.buttons && (
				<Stack gap={1}>
					{command.keyboard.buttons.map((button) => (
						<Node.Block
							key={button.id}
							variant='dark'
							className='position-relative text-center text-break'
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
						</Node.Block>
					))}
				</Stack>
			)}
		</Node>
	);
}

export default memo(CommandNode);
