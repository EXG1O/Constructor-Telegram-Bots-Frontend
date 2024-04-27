import { Node } from 'reactflow';

import {
	DiagramCommand,
	DiagramCondition,
	DiagramBackgroundTask,
} from 'services/api/telegram_bots/types';

export function parseNodes(
	diagramCommands: DiagramCommand[] = [],
	diagramConditions: DiagramCondition[] = [],
	diagramBackgroundTasks: DiagramBackgroundTask[] = [],
): Node[] {
	return Object.assign(
		diagramCommands.map(({ x, y, source_connections, target_connections, ...diagramCommand }) => ({
			id: `command:${diagramCommand.id}`,
			type: 'command',
			position: { x, y },
			data: diagramCommand,
		})),
		diagramConditions.map(({ x, y, source_connections, target_connections, ...diagramCondition }) => ({
			id: `condition:${diagramCondition.id}`,
			type: 'condition',
			position: { x, y },
			data: diagramCondition,
		})),
		diagramBackgroundTasks.map(({ x, y, target_connections, ...diagramBackgroundTask }) => ({
			id: `background_task:${diagramBackgroundTask.id}`,
			type: 'background_task',
			position: { x, y },
			data: diagramBackgroundTask,
		})),
	);
}