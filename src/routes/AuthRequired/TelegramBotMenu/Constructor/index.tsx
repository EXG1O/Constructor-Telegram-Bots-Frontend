import React, { ReactElement, useCallback, useRef } from 'react';
import { Params, useRouteLoaderData } from 'react-router-dom';
import ReactFlow, {
	Controls,
	MiniMap,
	Background,
	BackgroundVariant,
	useEdgesState,
	useNodesState,
	addEdge as _addEdge,
	updateEdge,
	NodeTypes,
	MarkerType,
	Connection,
	Node,
	Edge,
} from 'reactflow';

import 'reactflow/dist/style.css';
import './index.scss';

import Title from 'components/Title';

import Panel from './components/Panel';
import CommandNode from './components/CommandNode';

import useToast from 'services/hooks/useToast';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { parseNodes } from './utils';

import {
	ConnectionsAPI,
	ConnectionAPI,
	DiagramCommandsAPI,
	DiagramCommandAPI,
	DiagramConditionsAPI,
	DiagramConditionAPI,
	DiagramBackgroundTasksAPI,
	DiagramBackgroundTaskAPI,
} from 'services/api/telegram_bots/main';
import {
	DiagramCommand,
	DiagramCondition,
	DiagramBackgroundTask,
	APIResponse,
} from 'services/api/telegram_bots/types';

export interface LoaderData {
	diagramCommands: APIResponse.DiagramCommandsAPI.Get;
	diagramConditions: APIResponse.DiagramConditionsAPI.Get;
	diagramBackgroundTasks: APIResponse.DiagramBackgroundTasksAPI.Get;
}

export async function loader({ params }: { params: Params<'telegramBotID'> }): Promise<LoaderData | Response> {
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
		throw Error('Failed to fetch data!');
	}

	return {
		diagramCommands: diagramCommandsResponse.json,
		diagramConditions: diagramConditionsResponse.json,
		diagramBackgroundTasks: diagramBackgroundTasksResponse.json,
	}
}

type SourceHandle = ['command' | 'condition' | 'background_task', string, 'left' | 'right', string];
type TargetHandle = ['command' | 'condition', string, 'left' | 'right', string];

const nodeTypes: NodeTypes = { command: CommandNode };

function Constructor(): ReactElement {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;
	const {
		diagramCommands,
		diagramConditions,
		diagramBackgroundTasks,
	} = useRouteLoaderData('telegram-bot-menu-constructor') as LoaderData;

	const { createMessageToast } = useToast();

	const [nodes, setNodes, onNodesChange] = useNodesState(
		parseNodes(
			diagramCommands,
			diagramConditions,
			diagramBackgroundTasks,
		)
	);
	const [edges, setEdges, onEdgesChange] = useEdgesState(
		parseEdges(
			diagramCommands,
			diagramConditions,
			diagramBackgroundTasks,
		)
	);
	const edgeUpdating = useRef<Edge | null>(null);

	function parseEdges(
		diagramCommands?: DiagramCommand[],
		diagramConditions?: DiagramCondition[],
		diagramBackgroundTasks?: DiagramBackgroundTask[],
	): Edge[] {
		const _edges: Edge[] = [];

		diagramCommands?.forEach(diagramCommand => {
			diagramCommand.keyboard?.buttons.forEach(button => {
				button.source_connections.forEach(connection => {
					const source = `command:${diagramCommand.id}`;
					const target = `${connection.target_object_type}:${connection.target_object_id}`;

					_edges.push({
						id: `reactflow__edge-${connection.id}`,
						source: source,
						sourceHandle: `${source}:${connection.source_handle_position}:${connection.source_object_id}`,
						target: target,
						targetHandle: `${target}:${connection.target_handle_position}:0`,
					});
				});
			});
		});

		diagramConditions?.forEach(diagramCondition => {
			Object.assign(
				diagramCondition.source_connections,
				diagramCondition.target_connections,
			).forEach(connection => {
				const source = `${connection.source_object_type}:${connection.source_object_id}`;
				const target = `${connection.target_object_type}:${connection.target_object_id}`;

				_edges.push({
					id: `reactflow__edge-${connection.id}`,
					source: source,
					sourceHandle: `${source}:${connection.source_handle_position}:0`,
					target: target,
					targetHandle: `${target}:${connection.target_handle_position}:0`,
				});
			});
		});

		diagramBackgroundTasks?.forEach(diagramBackgroundTask => {
			diagramBackgroundTask.target_connections.forEach(connection => {
				const source = `${connection.source_object_type}:${connection.source_object_id}`;
				const target = `${connection.target_object_type}:${connection.target_object_id}`;

				_edges.push({
					id: `reactflow__edge-${connection.id}`,
					source: source,
					sourceHandle: `${source}:${connection.source_handle_position}:0`,
					target: target,
					targetHandle: `${target}:${connection.target_handle_position}:0`,
				});
			});
		});

		return _edges;
	}

	const updateNodes = useCallback(async () => {
		const [
			diagramCommandsResponse,
			diagramConditionsResponse,
			diagramBackgroundTasksResponse,
		] = await Promise.all([
			DiagramCommandsAPI.get(telegramBot.id),
			DiagramConditionsAPI.get(telegramBot.id),
			DiagramBackgroundTasksAPI.get(telegramBot.id),
		]);

		if (
			!diagramCommandsResponse.ok ||
			!diagramConditionsResponse.ok ||
			!diagramBackgroundTasksResponse.ok
		) {
			createMessageToast({
				message: gettext('Не удалось получить данные с сервера!'),
				level: 'error',
			});
			return;
		}

		setNodes(
			parseNodes(
				diagramCommandsResponse.json,
				diagramConditionsResponse.json,
				diagramBackgroundTasksResponse.json,
			)
		);
		setEdges(
			parseEdges(
				diagramCommandsResponse.json,
				diagramConditionsResponse.json,
				diagramBackgroundTasksResponse.json,
			)
		);
	}, []);

	const handleNodeDragStop = useCallback((event: React.MouseEvent, node: Node, nodes?: Node[]) => {
		nodes?.forEach(node => {
			const [type, id] = node.id.split(':') as ['command' | 'condition' | 'background_task', string];

			let updateDiagramBlockPosition: (
				typeof DiagramCommandAPI.update |
				typeof DiagramConditionAPI.update |
				typeof DiagramBackgroundTaskAPI.update |
				undefined
			) = undefined;

			if (type === 'command') {
				updateDiagramBlockPosition = DiagramCommandAPI.update;
			} else if (type === 'condition') {
				updateDiagramBlockPosition = DiagramConditionAPI.update;
			} else if (type === 'background_task') {
				updateDiagramBlockPosition = DiagramBackgroundTaskAPI.update;
			}

			updateDiagramBlockPosition?.(
				telegramBot.id,
				parseInt(id),
				node.position,
			);
		});
	}, []);

	const addEdge = useCallback(async (connection: Connection, shouldUpdateEdges: boolean = true): Promise<void> => {
		if (connection.source && connection.sourceHandle && connection.target && connection.targetHandle) {
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
				target_nested_object_id,
			] = connection.targetHandle.split(':') as TargetHandle;

			let makeRequest: ReturnType<typeof ConnectionsAPI.create>;

			if (source_object_type === 'command' && parseInt(source_nested_object_id) > 0) {
				makeRequest = ConnectionsAPI.create(telegramBot.id, {
					source_object_type: 'command_keyboard_button',
					source_object_id: parseInt(source_nested_object_id),
					source_handle_position,
					target_object_type,
					target_object_id: parseInt(target_object_id),
					target_handle_position,
				});
			} else {
				makeRequest = ConnectionsAPI.create(telegramBot.id, {
					source_object_type,
					source_object_id: parseInt(source_object_id),
					source_handle_position,
					target_object_type,
					target_object_id: parseInt(target_object_id),
					target_handle_position,
				});
			}

			const response = await makeRequest;

			if (response.ok) {
				if (shouldUpdateEdges) {
					setEdges(prevEdges => _addEdge({ ...connection, id: `reactflow__edge-${response.json.id}` }, prevEdges));
				}
			} else {
				createMessageToast({
					message: gettext('Не удалось подключить блок к другому блоку!'),
					level: 'error',
				});
			}
		}
	}, []);

	async function deleteEdge(edge: Edge, shouldUpdateEdges: boolean = true): Promise<void> {
		if (edge.sourceHandle) {
			const response = await ConnectionAPI._delete(telegramBot.id, parseInt(edge.id.split('-')[1]));

			if (response.ok) {
				if (shouldUpdateEdges) {
					setEdges(prevEdges => prevEdges.filter(prevEdge => prevEdge.id !== edge.id));
				}
			} else {
				createMessageToast({
					message: gettext('Не удалось отключить блок от другого блока!'),
					level: 'error',
				});
			}
		}
	}

	const handleEdgeUpdateStart = useCallback((event: React.MouseEvent, edge: Edge): void => {
		edgeUpdating.current = edge;
	}, []);

	const handleEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection): void => {
		if (
			edgeUpdating.current && (
				edgeUpdating.current.sourceHandle !== newConnection.sourceHandle ||
				edgeUpdating.current.targetHandle !== newConnection.targetHandle
			)
		) {
			deleteEdge(oldEdge, false);
			addEdge(newConnection, false);

			setEdges(prevEdges => updateEdge(oldEdge, newConnection, prevEdges));
		}

		edgeUpdating.current = null;
	}, []);

	const handleEdgeUpdateEnd = useCallback((event: MouseEvent | TouchEvent, edge: Edge): void => {
		if (edgeUpdating.current) {
			deleteEdge(edge);
		}

		edgeUpdating.current = null;
	}, []);

	const handleCheckValidConnection = useCallback((connection: Connection): boolean => {
		if (!(connection.source && connection.sourceHandle && connection.target && connection.targetHandle)) {
			return false;
		}

		if (connection.source === connection.target) {
			return false;
		}

		return true;
	}, [edges]);

	return (
		<Title title={gettext('Конструктор')}>
			<div
				className='border rounded'
				style={{ height: '100%', minHeight: '600px' }}
			>
				<ReactFlow
					fitView
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					defaultEdgeOptions={{
						markerEnd: {
							type: MarkerType.Arrow,
							strokeWidth: 1.8,
						},
					}}
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
			</div>
		</Title>
	);
}

export default Constructor;