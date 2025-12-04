import { Edge } from '@xyflow/react';

import { DiagramAPIRequest } from 'api/telegram-bots/api-request/types';
import { DiagramBackgroundTask } from 'api/telegram-bots/background-task/types';
import { DiagramCondition } from 'api/telegram-bots/condition/types';
import {
  Connection,
  ObjectType,
  SourceObjectType,
  TargetObjectType,
} from 'api/telegram-bots/connection/types';
import { DiagramDatabaseOperation } from 'api/telegram-bots/database-operation/types';
import { DiagramMessage } from 'api/telegram-bots/message/types';
import { DiagramTrigger } from 'api/telegram-bots/trigger/types';

export interface EdgePoint<OT extends ObjectType> {
  objectType: OT;
  objectID: number;
}

export interface EdgeSource extends EdgePoint<SourceObjectType> {}

export interface EdgeTarget extends EdgePoint<TargetObjectType> {}

export function parseEdgePoint<OT extends ObjectType>(point: string): EdgePoint<OT> {
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
  extends EdgeHandle<
    Exclude<SourceObjectType, 'message_keyboard_button'> | 'message'
  > {}

export interface EdgeTargetHandle extends EdgeHandle<TargetObjectType> {}

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
  messages?: DiagramMessage[];
  conditions?: DiagramCondition[];
  backgroundTasks?: DiagramBackgroundTask[];
  apiRequests?: DiagramAPIRequest[];
  databaseOperations?: DiagramDatabaseOperation[];
}

export function convertDiagramBlocksToEdges(diagramBlocks: DiagramBlocks): Edge[] {
  const connections: Connection[] = [
    ...(diagramBlocks.triggers?.flatMap((trigger) => [
      ...trigger.source_connections,
      ...trigger.target_connections,
    ]) ?? []),
    ...(diagramBlocks.messages?.flatMap((message) => [
      ...message.source_connections,
      ...message.target_connections,
      ...(message.keyboard?.buttons.flatMap((button) => button.source_connections) ??
        []),
    ]) ?? []),
    ...(diagramBlocks.conditions?.flatMap((condition) => [
      ...condition.source_connections,
      ...condition.target_connections,
    ]) ?? []),
    ...(diagramBlocks.backgroundTasks?.flatMap((task) => task.source_connections) ??
      []),
    ...(diagramBlocks.apiRequests?.flatMap((request) => [
      ...request.source_connections,
      ...request.target_connections,
    ]) ?? []),
    ...(diagramBlocks.databaseOperations?.flatMap((operation) => [
      ...operation.source_connections,
      ...operation.target_connections,
    ]) ?? []),
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
      connection.source_object_type === 'message_keyboard_button';

    const source: string = isKeyboardButtonConnection
      ? `message:${
          diagramBlocks.messages?.find((message) =>
            message.keyboard?.buttons.some(
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
