import React, { ReactElement, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactFlow, {
	addEdge as baseAddEdge,
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	DefaultEdgeOptions,
	Edge,
	MarkerType,
	MiniMap,
	Node,
	NodeTypes,
	updateEdge,
	useEdgesState,
	useNodesState,
} from 'reactflow';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Page from 'components/Page';
import { createMessageToast } from 'components/ToastContainer';

import CommandNode from './components/CommandNode';
import CommandOffcanvas from './components/CommandOffcanvas';
import Panel from './components/Panel';

import useTelegramBotMenuConstructorRouteLoaderData from './hooks/useTelegramBotMenuConstructorRouteLoaderData';

import 'reactflow/dist/base.css';
import './index.scss';

import {
	ConnectionAPI,
	ConnectionsAPI,
	DiagramBackgroundTaskAPI,
	DiagramCommandAPI,
	DiagramConditionAPI,
} from 'services/api/telegram_bots/main';

import {
	parseDiagramBackgroundTaskEdges,
	parseDiagramBackgroundTaskNodes,
	parseDiagramCommandEdges,
	parseDiagramCommandNodes,
	parseDiagramConditionEdges,
	parseDiagramConditionNodes,
} from './utils';

type SourceHandle = [
	'command' | 'condition' | 'background_task',
	string,
	'left' | 'right',
	string,
];
type TargetHandle = ['command' | 'condition', string, 'left' | 'right', string];

const nodeTypes: NodeTypes = { command: CommandNode };
const defaultEdgeOptions: DefaultEdgeOptions = {
	markerEnd: {
		type: MarkerType.Arrow,
		strokeWidth: 1.8,
	},
};

function Constructor(): ReactElement {
	const { t, i18n } = useTranslation('telegram-bot-menu-constructor');

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();
	const { diagramCommands, diagramConditions, diagramBackgroundTasks } =
		useTelegramBotMenuConstructorRouteLoaderData();

	const [nodes, setNodes, onNodesChange] = useNodesState(
		Object.assign(
			parseDiagramCommandNodes(diagramCommands),
			parseDiagramConditionNodes(diagramConditions),
			parseDiagramBackgroundTaskNodes(diagramBackgroundTasks),
		),
	);
	const [edges, setEdges, onEdgesChange] = useEdgesState(
		Object.assign(
			parseDiagramCommandEdges(diagramCommands),
			parseDiagramConditionEdges(diagramConditions),
			parseDiagramBackgroundTaskEdges(diagramBackgroundTasks),
		),
	);
	const edgeUpdating = useRef<Edge | null>(null);

	const handleNodeDragStop = useCallback(
		(_event: React.MouseEvent, _node: Node, nodes?: Node[]) => {
			nodes?.forEach(async (node) => {
				const [type, id] = node.id.split(':') as [
					'command' | 'condition' | 'background_task',
					string,
				];

				await (
					type === 'command'
						? DiagramCommandAPI.update
						: type === 'condition'
							? DiagramConditionAPI.update
							: type === 'background_task'
								? DiagramBackgroundTaskAPI.update
								: undefined
				)?.(telegramBot.id, parseInt(id), node.position);
			});
		},
		[],
	);

	const addEdge = useCallback(
		async (connection: Connection, shouldUpdateEdges: boolean = true) => {
			if (
				connection.source &&
				connection.sourceHandle &&
				connection.target &&
				connection.targetHandle
			) {
				const [
					source_object_type,
					source_object_id,
					source_handle_position,
					source_nested_object_id,
				] = connection.sourceHandle.split(':') as SourceHandle;
				const [
					target_object_type,
					target_object_id,
					target_handle_position,
					_target_nested_object_id,
				] = connection.targetHandle.split(':') as TargetHandle;

				const response = await ConnectionsAPI.create(telegramBot.id, {
					...(source_object_type === 'command' &&
					parseInt(source_nested_object_id) > 0
						? {
								source_object_type: 'command_keyboard_button',
								source_object_id: parseInt(source_nested_object_id),
							}
						: {
								source_object_type,
								source_object_id: parseInt(source_object_id),
							}),
					source_handle_position,
					target_object_type,
					target_object_id: parseInt(target_object_id),
					target_handle_position,
				});

				if (response.ok) {
					if (shouldUpdateEdges) {
						setEdges((prevEdges) =>
							baseAddEdge(
								{
									...connection,
									id: `reactflow__edge-${response.json.id}`,
								},
								prevEdges,
							),
						);
					}
				} else {
					createMessageToast({
						message: t('messages.createConnection.error'),
						level: 'error',
					});
				}
			}
		},
		[i18n.language],
	);

	async function deleteEdge(
		edge: Edge,
		shouldUpdateEdges: boolean = true,
	): Promise<void> {
		if (edge.sourceHandle) {
			const response = await ConnectionAPI.delete(
				telegramBot.id,
				parseInt(edge.id.split('-')[1]),
			);

			if (response.ok) {
				if (shouldUpdateEdges) {
					setEdges((prevEdges) =>
						prevEdges.filter((prevEdge) => prevEdge.id !== edge.id),
					);
				}
			} else {
				createMessageToast({
					message: t('messages.deleteConnection.error'),
					level: 'error',
				});
			}
		}
	}

	const handleEdgeUpdateStart = useCallback(
		(_event: React.MouseEvent, edge: Edge) => {
			edgeUpdating.current = edge;
		},
		[],
	);

	const handleEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
		if (
			edgeUpdating.current &&
			(edgeUpdating.current.sourceHandle !== newConnection.sourceHandle ||
				edgeUpdating.current.targetHandle !== newConnection.targetHandle)
		) {
			deleteEdge(oldEdge, false);
			addEdge(newConnection, false);

			setEdges((prevEdges) => updateEdge(oldEdge, newConnection, prevEdges));
		}

		edgeUpdating.current = null;
	}, []);

	const handleEdgeUpdateEnd = useCallback(
		(_event: MouseEvent | TouchEvent, edge: Edge) => {
			if (edgeUpdating.current) {
				deleteEdge(edge);
			}

			edgeUpdating.current = null;
		},
		[],
	);

	const handleCheckValidConnection = useCallback(
		(connection: Connection): boolean =>
			Boolean(connection.source) &&
			Boolean(connection.sourceHandle) &&
			Boolean(connection.target) &&
			Boolean(connection.targetHandle) &&
			connection.source !== connection.target,
		[],
	);

	return (
		<Page title={t('title')} grid>
			<div
				className='bg-light rounded-4 overflow-hidden'
				style={{ height: '100%', minHeight: '600px' }}
			>
				<CommandOffcanvas.StoreProvider
					onAdd={useCallback(
						(diagramCommand) =>
							setNodes((prevNodes) => [
								...prevNodes,
								...parseDiagramCommandNodes([diagramCommand]),
							]),
						[],
					)}
					onSave={useCallback(
						(commandID, diagramCommand) =>
							setNodes((prevNodes) =>
								prevNodes.map((node) =>
									node.id === `command:${commandID}`
										? parseDiagramCommandNodes([diagramCommand])[0]
										: node,
								),
							),
						[],
					)}
				>
					<CommandOffcanvas />
					<ReactFlow
						fitView
						nodes={nodes}
						edges={edges}
						nodeTypes={nodeTypes}
						defaultEdgeOptions={defaultEdgeOptions}
						deleteKeyCode={null}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onNodeDragStop={handleNodeDragStop}
						onEdgeUpdateStart={handleEdgeUpdateStart}
						onEdgeUpdate={handleEdgeUpdate}
						onEdgeUpdateEnd={handleEdgeUpdateEnd}
						isValidConnection={handleCheckValidConnection}
						onConnect={addEdge}
					>
						<Panel />
						<Controls
							showInteractive={false}
							className='border rounded-1 overflow-hidden'
						/>
						<MiniMap
							maskColor='rgba(var(--bs-light-rgb), var(--bs-bg-opacity))'
							className='border rounded-1 overflow-hidden'
						/>
						<Background
							variant={BackgroundVariant.Dots}
							size={1}
							gap={20}
						/>
					</ReactFlow>
				</CommandOffcanvas.StoreProvider>
			</div>
		</Page>
	);
}

export default Constructor;
