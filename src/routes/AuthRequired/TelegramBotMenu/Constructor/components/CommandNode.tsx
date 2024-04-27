import React, { ReactElement, useState, useCallback } from 'react';
import { useRouteLoaderData } from 'react-router';
import { NodeProps, Handle, Position, useReactFlow } from 'reactflow';

import './CommandNode.scss';

import Stack from 'react-bootstrap/Stack';

import AskConfirmModal from 'components/AskConfirmModal';

import CommandEditOffcanvas from './CommandEditOffcanvas';
import NodeToolbar from './NodeToolbar';

import useToast from 'services/hooks/useToast';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { CommandAPI } from 'services/api/telegram_bots/main';
import { DiagramBlock, DiagramCommand } from 'services/api/telegram_bots/types';

interface NodeData extends Omit<DiagramCommand, keyof DiagramBlock> {
	updateNodes: () => Promise<void>;
}

interface CommandNodeProps extends Omit<NodeProps, 'data'>{
	data: NodeData;
}

function CommandNode({ id, data }: CommandNodeProps): ReactElement<CommandNodeProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();

	const { setNodes } = useReactFlow();

	const [showDeletionModal, setShowDeletionModal] = useState<boolean>(false);
	const [showEditOffcanvas, setShowEditOffcanvas] = useState<boolean>(false);

	const handleConfirmDelete = useCallback(async (): Promise<void> => {
		const response = await CommandAPI._delete(telegramBot.id, data.id);

		if (response.ok) {
			setNodes(prevNodes => prevNodes.filter(node => node.id !== id));
			setShowDeletionModal(false);
			createMessageToast({
				message: gettext('Вы успешно удалили команду.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось удалить команду!'),
				level: 'error',
			});
		}
	}, []);

	return (
		<>
			<AskConfirmModal
				show={showDeletionModal}
				title={gettext('Удаление команды')}
				onConfirm={handleConfirmDelete}
				onHide={useCallback(() => setShowDeletionModal(false), [])}
			>
				{gettext('Вы точно хотите удалить команду?')}
			</AskConfirmModal>
			<CommandEditOffcanvas
				show={showEditOffcanvas}
				commandID={data.id}
				onHide={useCallback(() => setShowEditOffcanvas(false), [])}
			/>
			<NodeToolbar
				title={gettext('Команда')}
				onEdit={useCallback(() => setShowDeletionModal(true), [])}
				onDelete={useCallback(() => setShowEditOffcanvas(true), [])}
			/>
			<Stack gap={2} style={{ width: '300px' }}>
				<div className='bg-light border rounded text-center text-break px-3 py-2' style={{ position: 'relative' }}>
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
						{data.keyboard.buttons.map(button => (
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

export default CommandNode;