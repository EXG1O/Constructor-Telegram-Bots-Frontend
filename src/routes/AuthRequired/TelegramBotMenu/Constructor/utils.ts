import { Edge, Node } from 'reactflow';

import {
	Connection,
	DiagramBackgroundTask,
	DiagramCommand,
	DiagramCondition,
} from 'api/telegram_bots/types';

export function parseDiagramCommandNodes(diagramCommands: DiagramCommand[]): Node[] {
	return diagramCommands.map(({ x, y, target_connections, ...diagramCommand }) => ({
		id: `command:${diagramCommand.id}`,
		type: 'command',
		position: { x, y },
		data: diagramCommand,
	}));
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
		({ x, y, source_connections, ...diagramBackgroundTask }) => ({
			id: `background_task:${diagramBackgroundTask.id}`,
			type: 'background_task',
			position: { x, y },
			data: diagramBackgroundTask,
		}),
	);
}

export function parseEdges(
	diagramCommands: DiagramCommand[],
	diagramConditions: DiagramCondition[],
	diagramBackgroundTasks: DiagramBackgroundTask[],
): Edge[] {
	const connections: Connection[] = [
		...diagramCommands.flatMap((command) => [
			...command.target_connections,
			...(command.keyboard?.buttons.flatMap(
				(button) => button.source_connections,
			) ?? []),
		]),
		...diagramConditions.flatMap((condition) => [
			...condition.source_connections,
			...condition.target_connections,
		]),
		...diagramBackgroundTasks.flatMap((task) => task.source_connections),
	];

	const seen = new Set<string>();
	const uniqueConnections: Connection[] = connections.filter((connection) => {
		const key = connection.id.toString();

		if (seen.has(key)) return false;

		seen.add(key);
		return true;
	});

	return uniqueConnections.map((connection) => {
		const isKeyboardButtonConnection: boolean =
			connection.source_object_type === 'command_keyboard_button';

		const source: string = isKeyboardButtonConnection
			? `command:${
					diagramCommands.find((command) =>
						command.keyboard?.buttons.some(
							(button) => button.id === connection.source_object_id,
						),
					)?.id
				}`
			: `${connection.source_object_type}:${connection.source_object_id}`;
		const target: string = `${connection.target_object_type}:${connection.target_object_id}`;

		return {
			id: `reactflow__edge-${connection.id}`,
			source,
			sourceHandle:
				`${source}:${connection.source_handle_position}:` +
				(isKeyboardButtonConnection
					? connection.source_object_id
					: 0
				).toString(),
			target,
			targetHandle: `${target}:${connection.target_handle_position}:0`,
		};
	});
}
