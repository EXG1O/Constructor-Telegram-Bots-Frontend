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

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Page from 'components/Page';
import { createMessageToast } from 'components/ToastContainer';

import BackgroundTaskNode from './components/BackgroundTaskNode';
import BackgroundTaskOffcanvas from './components/BackgroundTaskOffcanvas';
import CommandNode from './components/CommandNode';
import CommandOffcanvas from './components/CommandOffcanvas';
import ConditionNode from './components/ConditionNode';
import ConditionOffcanvas from './components/ConditionOffcanvas';
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
	BackgroundTask,
	Command,
	Condition,
	DiagramBackgroundTask,
	DiagramCommand,
	DiagramCondition,
} from 'services/api/telegram_bots/types';

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

const nodeTypes: NodeTypes = {
	command: CommandNode,
	condition: ConditionNode,
	background_task: BackgroundTaskNode,
};
const defaultEdgeOptions: DefaultEdgeOptions = {
	markerEnd: {
		type: MarkerType.Arrow,
		strokeWidth: 1.8,
	},
};

function Constructor(): ReactElement {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor);

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();
	const { diagramCommands, diagramConditions, diagramBackgroundTasks } =
		useTelegramBotMenuConstructorRouteLoaderData();

	const [nodes, setNodes, onNodesChange] = useNodesState([
		...parseDiagramCommandNodes(diagramCommands),
		...parseDiagramConditionNodes(diagramConditions),
		...parseDiagramBackgroundTaskNodes(diagramBackgroundTasks),
	]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([
		...parseDiagramCommandEdges(diagramCommands),
		...parseDiagramConditionEdges(diagramConditions),
		...parseDiagramBackgroundTaskEdges(diagramBackgroundTasks),
	]);
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
						? DiagramCommandAPI
						: type === 'condition'
							? DiagramConditionAPI
							: type === 'background_task'
								? DiagramBackgroundTaskAPI
								: undefined
				)?.update(telegramBot.id, parseInt(id), node.position);
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

	async function getDiagramCommand(
		commandID: Command['id'],
	): Promise<DiagramCommand | null> {
		const response = await DiagramCommandAPI.get(telegramBot.id, commandID);

		if (!response.ok) {
			createMessageToast({
				message: t('messages.getDiagramCommand.error'),
				level: 'error',
			});
		}

		return response.ok ? response.json : null;
	}

	async function handleAddDiagramCommandToNode(command: Command): Promise<void> {
		const diagramCommand: DiagramCommand | null = await getDiagramCommand(
			command.id,
		);
		if (diagramCommand)
			setNodes((prevNodes) => [
				...prevNodes,
				...parseDiagramCommandNodes([diagramCommand]),
			]);
	}

	async function handleSaveDiagramCommandNode(command: Command): Promise<void> {
		const diagramCommand: DiagramCommand | null = await getDiagramCommand(
			command.id,
		);
		if (diagramCommand)
			setNodes((prevNodes) =>
				prevNodes.map((node) =>
					node.id === `command:${command.id}`
						? parseDiagramCommandNodes([diagramCommand])[0]
						: node,
				),
			);
	}

	async function getDiagramCondition(
		conditionID: Condition['id'],
	): Promise<DiagramCondition | null> {
		const response = await DiagramConditionAPI.get(telegramBot.id, conditionID);

		if (!response.ok) {
			createMessageToast({
				message: t('messages.getDiagramCondition.error'),
				level: 'error',
			});
		}

		return response.ok ? response.json : null;
	}

	async function handleAddDiagramConditionToNode(
		condition: Condition,
	): Promise<void> {
		const diagramCondition: DiagramCondition | null = await getDiagramCondition(
			condition.id,
		);
		if (diagramCondition)
			setNodes((prevNodes) => [
				...prevNodes,
				...parseDiagramConditionNodes([diagramCondition]),
			]);
	}

	async function handleSaveDiagramConditionNode(condition: Condition): Promise<void> {
		const diagramCondition: DiagramCondition | null = await getDiagramCondition(
			condition.id,
		);
		if (diagramCondition)
			setNodes((prevNodes) =>
				prevNodes.map((node) =>
					node.id === `condition:${condition.id}`
						? parseDiagramConditionNodes([diagramCondition])[0]
						: node,
				),
			);
	}

	async function getDiagramBackgroundTask(
		conditionID: BackgroundTask['id'],
	): Promise<DiagramBackgroundTask | null> {
		const response = await DiagramBackgroundTaskAPI.get(
			telegramBot.id,
			conditionID,
		);

		if (!response.ok) {
			createMessageToast({
				message: t('messages.getDiagramBackgroundTask.error'),
				level: 'error',
			});
		}

		return response.ok ? response.json : null;
	}

	async function handleAddDiagramBackgroundTaskToNode(
		condition: BackgroundTask,
	): Promise<void> {
		const diagramBackgroundTask: DiagramBackgroundTask | null =
			await getDiagramBackgroundTask(condition.id);
		if (diagramBackgroundTask)
			setNodes((prevNodes) => [
				...prevNodes,
				...parseDiagramBackgroundTaskNodes([diagramBackgroundTask]),
			]);
	}

	async function handleSaveDiagramBackgroundTaskNode(
		condition: BackgroundTask,
	): Promise<void> {
		const diagramBackgroundTask: DiagramBackgroundTask | null =
			await getDiagramBackgroundTask(condition.id);
		if (diagramBackgroundTask)
			setNodes((prevNodes) =>
				prevNodes.map((node) =>
					node.id === `background_task:${condition.id}`
						? parseDiagramBackgroundTaskNodes([diagramBackgroundTask])[0]
						: node,
				),
			);
	}

	return (
		<Page title={t('title')} grid>
			<CommandOffcanvas
				onAdd={handleAddDiagramCommandToNode}
				onSave={handleSaveDiagramCommandNode}
			/>
			<ConditionOffcanvas
				onAdd={handleAddDiagramConditionToNode}
				onSave={handleSaveDiagramConditionNode}
			/>
			<BackgroundTaskOffcanvas
				onAdd={handleAddDiagramBackgroundTaskToNode}
				onSave={handleSaveDiagramBackgroundTaskNode}
			/>
			<div
				className='bg-light rounded-4 overflow-hidden'
				style={{ height: '100%', minHeight: '600px' }}
			>
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
					<Background variant={BackgroundVariant.Dots} size={1} gap={20} />
				</ReactFlow>
			</div>
		</Page>
	);
}

export default Constructor;
