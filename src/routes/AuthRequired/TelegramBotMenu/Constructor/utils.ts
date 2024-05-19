import { Node, Edge } from 'reactflow';

import {
	DiagramCommand,
	DiagramCondition,
	DiagramBackgroundTask,
} from 'services/api/telegram_bots/types';

export function parseDiagramCommandNodes(diagramCommands: DiagramCommand[]): Node[] {
	return diagramCommands.map(
		({ x, y, source_connections, target_connections, ...diagramCommand }) => ({
			id: `command:${diagramCommand.id}`,
			type: 'command',
			position: { x, y },
			data: diagramCommand,
		}),
	);
}

export function parseDiagramConditionNodes(
	diagramConditions: DiagramCondition[],
): Node[] {
	return diagramConditions.map(
		({ x, y, source_connections, target_connections, ...diagramCondition }) => ({
			id: `condition:${diagramCondition.id}`,
			type: 'condition',
			position: { x, y },
			data: diagramCondition,
		}),
	);
}

export function parseDiagramBackgroundTaskNodes(
	diagramBackgroundTasks: DiagramBackgroundTask[],
): Node[] {
	return diagramBackgroundTasks.map(
		({ x, y, target_connections, ...diagramBackgroundTask }) => ({
			id: `background_task:${diagramBackgroundTask.id}`,
			type: 'background_task',
			position: { x, y },
			data: diagramBackgroundTask,
		}),
	);
}

export function parseDiagramCommandEdges(diagramCommands: DiagramCommand[]): Edge[] {
	return diagramCommands.reduce<Edge[]>((edges, diagramCommand) => {
		diagramCommand.keyboard?.buttons.forEach((button) => {
			button.source_connections.forEach((connection) => {
				const source: string = `command:${diagramCommand.id}`;
				const target: string = `${connection.target_object_type}:${connection.target_object_id}`;

				edges.push({
					id: `reactflow__edge-${connection.id}`,
					source,
					sourceHandle: `${source}:${connection.source_handle_position}:${connection.source_object_id}`,
					target,
					targetHandle: `${target}:${connection.target_handle_position}:0`,
				});
			});
		});

		return edges;
	}, []);
}

export function parseDiagramConditionEdges(
	diagramConditions: DiagramCondition[],
): Edge[] {
	return diagramConditions.reduce<Edge[]>((edges, diagramCondition) => {
		Object.assign(
			diagramCondition.source_connections,
			diagramCondition.target_connections,
		).forEach((connection) => {
			const source: string = `${connection.source_object_type}:${connection.source_object_id}`;
			const target: string = `${connection.target_object_type}:${connection.target_object_id}`;

			edges.push({
				id: `reactflow__edge-${connection.id}`,
				source,
				sourceHandle: `${source}:${connection.source_handle_position}:0`,
				target,
				targetHandle: `${target}:${connection.target_handle_position}:0`,
			});
		});

		return edges;
	}, []);
}

export function parseDiagramBackgroundTaskEdges(
	diagramBackgroundTasks: DiagramBackgroundTask[],
): Edge[] {
	return diagramBackgroundTasks.reduce<Edge[]>((edges, diagramBackgroundTask) => {
		diagramBackgroundTask.target_connections.forEach((connection) => {
			const source: string = `${connection.source_object_type}:${connection.source_object_id}`;
			const target: string = `${connection.target_object_type}:${connection.target_object_id}`;

			edges.push({
				id: `reactflow__edge-${connection.id}`,
				source,
				sourceHandle: `${source}:${connection.source_handle_position}:0`,
				target,
				targetHandle: `${target}:${connection.target_handle_position}:0`,
			});
		});

		return edges;
	}, []);
}
