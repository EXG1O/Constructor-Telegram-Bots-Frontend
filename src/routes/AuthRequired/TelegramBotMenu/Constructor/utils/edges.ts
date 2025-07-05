import { Edge } from '@xyflow/react';

import {
  Connection,
  DiagramBackgroundTask,
  DiagramCommand,
  DiagramCondition,
  DiagramTrigger,
} from 'api/telegram_bots/types';

export interface EdgePoint<ObjectType extends string> {
  objectType: ObjectType;
  objectID: number;
}

export interface EdgeSource
  extends EdgePoint<'trigger' | 'command' | 'condition' | 'background_task'> {}

export interface EdgeTarget extends EdgePoint<'command' | 'condition'> {}

export function parseEdgePoint<ObjectType extends string>(
  point: string,
): EdgePoint<ObjectType> {
  const [objectType, objectID] = point.split(':');
  return {
    objectType,
    objectID: parseInt(objectID),
  } as any;
}

export function parseEdgeSource(point: string): EdgeSource {
  return parseEdgePoint(point);
}

export function parseEdgeTarget(point: string): EdgeTarget {
  return parseEdgePoint(point);
}

export interface EdgeHandle<ObjectType extends string> {
  objectType: ObjectType;
  objectID: number;
  position: 'left' | 'right';
  nestedObjectID: number;
}

export interface EdgeSourceHandle
  extends EdgeHandle<'trigger' | 'command' | 'condition' | 'background_task'> {}

export interface EdgeTargetHandle extends EdgeHandle<'command' | 'condition'> {}

export function parseEdgeHandle<ObjectType extends string>(
  handle: string,
): EdgeHandle<ObjectType> {
  const [objectType, objectID, position, nestedObjectID] = handle.split(':');
  return {
    objectType,
    objectID: parseInt(objectID),
    position,
    nestedObjectID: parseInt(nestedObjectID),
  } as any;
}

export function parseEdgeSourceHandle(handle: string): EdgeSourceHandle {
  return parseEdgeHandle(handle);
}

export function parseEdgeTargetHandle(handle: string): EdgeTargetHandle {
  return parseEdgeHandle(handle);
}

export function buildEdgeHandle<ObjectType extends string>(
  handle: EdgeHandle<ObjectType>,
): string {
  return [
    handle.objectType,
    handle.objectID,
    handle.position,
    handle.nestedObjectID,
  ].join(':');
}

export function buildEdgeSourceHandle(handle: EdgeSourceHandle): string {
  return buildEdgeHandle(handle);
}

export function buildEdgeTargetHandle(handle: EdgeTargetHandle): string {
  return buildEdgeHandle(handle);
}

export interface DiagramBlocks {
  triggers?: DiagramTrigger[];
  commands?: DiagramCommand[];
  conditions?: DiagramCondition[];
  backgroundTasks?: DiagramBackgroundTask[];
}

export function convertDiagramBlocksToEdges(diagramBlocks: DiagramBlocks): Edge[] {
  const connections: Connection[] = [
    ...(diagramBlocks.triggers?.flatMap((trigger) => trigger.source_connections) ?? []),
    ...(diagramBlocks.commands?.flatMap((command) => [
      ...command.target_connections,
      ...(command.keyboard?.buttons.flatMap((button) => button.source_connections) ??
        []),
    ]) ?? []),
    ...(diagramBlocks.conditions?.flatMap((condition) => [
      ...condition.source_connections,
      ...condition.target_connections,
    ]) ?? []),
    ...(diagramBlocks.backgroundTasks?.flatMap((task) => task.source_connections) ??
      []),
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
          diagramBlocks.commands?.find((command) =>
            command.keyboard?.buttons.some(
              (button) => button.id === connection.source_object_id,
            ),
          )?.id
        }`
      : `${connection.source_object_type}:${connection.source_object_id}`;
    const target: string = `${connection.target_object_type}:${connection.target_object_id}`;

    return {
      id: connection.id.toString(),
      source,
      sourceHandle:
        `${source}:${connection.source_handle_position}:` +
        (isKeyboardButtonConnection ? connection.source_object_id : 0).toString(),
      target,
      targetHandle: `${target}:${connection.target_handle_position}:0`,
    };
  });
}
