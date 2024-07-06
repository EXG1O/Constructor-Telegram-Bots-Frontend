import React, { ReactElement, useCallback, useRef } from 'react';
import { Params, useRouteLoaderData } from 'react-router-dom';
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

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import Page from 'components/Page';
import { createMessageToast } from 'components/ToastContainer';

import CommandNode from './components/CommandNode';
import CommandOffcanvas from './components/CommandOffcanvas';
import Panel from './components/Panel';

import 'reactflow/dist/style.css';
import './index.scss';

import {
	ConnectionAPI,
	ConnectionsAPI,
	DiagramBackgroundTaskAPI,
	DiagramBackgroundTasksAPI,
	DiagramCommandAPI,
	DiagramCommandsAPI,
	DiagramConditionAPI,
	DiagramConditionsAPI,
} from 'services/api/telegram_bots/main';
import { APIResponse } from 'services/api/telegram_bots/types';

import {
	parseDiagramBackgroundTaskEdges,
	parseDiagramBackgroundTaskNodes,
	parseDiagramCommandEdges,
	parseDiagramCommandNodes,
	parseDiagramConditionEdges,
	parseDiagramConditionNodes,
} from './utils';

export interface LoaderData {
	diagramCommands: APIResponse.DiagramCommandsAPI.Get;
	diagramConditions: APIResponse.DiagramConditionsAPI.Get;
	diagramBackgroundTasks: APIResponse.DiagramBackgroundTasksAPI.Get;
}

export async function loader({
	params,
}: {
	params: Params<'telegramBotID'>;
}): Promise<LoaderData | Response> {
	const telegramBotID: number = parseInt(params.telegramBotID!);

	const [
		diagramCommandsResponse,
		diagramConditionsResponse,
		diagramBackgroundTasksResponse,
	] = await Promise.all([
		DiagramCommandsAPI.get(telegramBotID),
		DiagramConditionsAPI.get(telegramBotID),
		DiagramBackgroundTasksAPI.get(telegramBotID),
	]);

	if (
		!diagramCommandsResponse.ok ||
		!diagramConditionsResponse.ok ||
		!diagramBackgroundTasksResponse.ok
	) {
		throw Error('Failed to fetch data.');
	}

	return {
		diagramCommands: diagramCommandsResponse.json,
		diagramConditions: diagramConditionsResponse.json,
		diagramBackgroundTasks: diagramBackgroundTasksResponse.json,
	};
}

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
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;
	const { diagramCommands, diagramConditions, diagramBackgroundTasks } =
		useRouteLoaderData('telegram-bot-menu-constructor') as LoaderData;

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
						message: gettext('Не удалось подключить блок к другому блоку.'),
						level: 'error',
					});
				}
			}
		},
		[],
	);

	async function deleteEdge(
		edge: Edge,
		shouldUpdateEdges: boolean = true,
	): Promise<void> {
		if (edge.sourceHandle) {
			const response = await ConnectionAPI._delete(
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
					message: gettext('Не удалось отключить блок от другого блока.'),
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
		<Page title={gettext('Конструктор')} grid>
			<div
				className='border rounded'
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
							className='border rounded-1'
						/>
						<MiniMap className='border rounded-1' />
						<Background
							variant={BackgroundVariant.Dots}
							size={1}
							gap={24}
						/>
					</ReactFlow>
				</CommandOffcanvas.StoreProvider>
			</div>
		</Page>
	);
}

export default Constructor;
