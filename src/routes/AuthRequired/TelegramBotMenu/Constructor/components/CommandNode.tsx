import React, { ReactElement, memo, useCallback } from 'react';
import { useRouteLoaderData } from 'react-router';

import './CommandNode.scss';

import { NodeProps, Handle, Position, useStore } from 'reactflow';

import Stack from 'react-bootstrap/Stack';

import NodeToolbar from './NodeToolbar';

import useToast from 'services/hooks/useToast';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';

import useCommandOffcanvasStore from './CommandOffcanvas/hooks/useCommandOffcanvasStore';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { CommandAPI } from 'services/api/telegram_bots/main';
import { DiagramBlock, DiagramCommand } from 'services/api/telegram_bots/types';

type Data = Omit<DiagramCommand, keyof DiagramBlock>;

export type CommandNodeProps = NodeProps<Data>;

function CommandNode({ id, data }: CommandNodeProps): ReactElement<CommandNodeProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();

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
				title: gettext('Удаление команды'),
				text: gettext('Вы точно хотите удалить команду?'),
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await CommandAPI._delete(telegramBot.id, data.id);

					if (response.ok) {
						onNodesChange?.([{ id, type: 'remove' }]);
						hideAskConfirmModal();
						createMessageToast({
							message: gettext('Вы успешно удалили команду.'),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: gettext('Не удалось удалить команду.'),
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
		<>
			<NodeToolbar
				title={gettext('Команда')}
				onEdit={useCallback(() => showEditCommandOffcanvas(data.id), [data.id])}
				onDelete={showDeleteModal}
			/>
			<Stack gap={2} style={{ width: '300px' }}>
				<div
					className='bg-light border rounded text-center text-break px-3 py-2'
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
					className='message-text-block bg-light border rounded px-3 py-2'
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
