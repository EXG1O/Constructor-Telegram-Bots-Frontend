import type { Edge } from '@xyflow/react';

import {
  type Connection,
  type ConnectionHandlePosition,
  type ConnectionObjectType,
  ConnectionSourceObjectType,
  type ConnectionTargetObjectType,
  type DiagramBlock,
  type DiagramMessage,
} from 'api';

export interface EdgePoint<TObjectType extends ConnectionObjectType> {
  objectType: TObjectType;
  objectID: number;
}

export interface EdgeSource extends EdgePoint<ConnectionSourceObjectType> {}

export interface EdgeTarget extends EdgePoint<ConnectionTargetObjectType> {}

export function parseEdgePoint<TObjectType extends ConnectionObjectType>(
  point: string,
): EdgePoint<TObjectType> {
  const [objectType, objectID] = point.split(':');
  return { objectType: objectType as TObjectType, objectID: Number(objectID) };
}

export function parseEdgeSource(point: string): EdgeSource {
  return parseEdgePoint(point);
}

export function parseEdgeTarget(point: string): EdgeTarget {
  return parseEdgePoint(point);
}

export function buildEdgePoint<TObjectType extends ConnectionObjectType>(
  handle: EdgePoint<TObjectType>,
): string {
  return [handle.objectType, handle.objectID].join(':');
}

export interface EdgeHandle<TObjectType extends ConnectionObjectType> {
  objectType: TObjectType;
  objectID: number;
  position: ConnectionHandlePosition;
  nestedObjectID: number;
}

export interface EdgeSourceHandle extends EdgeHandle<
  Exclude<ConnectionSourceObjectType, ConnectionSourceObjectType.MessageKeyboardButton>
> {}

export interface EdgeTargetHandle extends EdgeHandle<ConnectionTargetObjectType> {}

export function parseEdgeHandle<TObjectType extends ConnectionObjectType>(
  handle: string,
): EdgeHandle<TObjectType> {
  const [objectType, objectID, position, nestedObjectID] = handle.split(':');
  return {
    objectType: objectType as TObjectType,
    objectID: parseInt(objectID),
    position: position as ConnectionHandlePosition,
    nestedObjectID: parseInt(nestedObjectID),
  };
}

export function parseEdgeSourceHandle(handle: string): EdgeSourceHandle {
  return parseEdgeHandle(handle);
}

export function parseEdgeTargetHandle(handle: string): EdgeTargetHandle {
  return parseEdgeHandle(handle);
}

export function buildEdgeHandle<TObjectType extends ConnectionObjectType>(
  handle: EdgeHandle<TObjectType>,
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
  messages?: DiagramMessage[];
  other?: Exclude<DiagramBlock, DiagramMessage>[];
}

export function convertDiagramBlocksToEdges(diagramBlocks: DiagramBlocks): Edge[] {
  const connections: Connection[] = [
    ...(diagramBlocks.messages?.flatMap((message) => [
      ...message.source_connections,
      ...(message.keyboard?.buttons.flatMap((button) => button.source_connections) ??
        []),
    ]) ?? []),
    ...(diagramBlocks.other?.flatMap((other) => other.source_connections) ?? []),
  ];

  return connections.map((connection) => {
    const isKeyboardButtonConnection: boolean =
      connection.source_object_type ===
      ConnectionSourceObjectType.MessageKeyboardButton;

    const sourceHandle: EdgeSourceHandle = {
      objectType: isKeyboardButtonConnection
        ? ConnectionSourceObjectType.Message
        : (connection.source_object_type as Exclude<
            ConnectionSourceObjectType,
            ConnectionSourceObjectType.MessageKeyboardButton
          >),
      objectID:
        (isKeyboardButtonConnection &&
          diagramBlocks.messages?.find((message) =>
            message.keyboard?.buttons.some(
              (button) => button.id === connection.source_object_id,
            ),
          )?.id) ||
        connection.source_object_id,
      position: connection.source_handle_position,
      nestedObjectID: isKeyboardButtonConnection ? connection.source_object_id : 0,
    };
    const targetHandle: EdgeTargetHandle = {
      objectType: connection.target_object_type,
      objectID: connection.target_object_id,
      position: connection.target_handle_position,
      nestedObjectID: 0,
    };

    return {
      id: connection.id.toString(),
      source: buildEdgePoint(sourceHandle),
      sourceHandle: buildEdgeHandle(sourceHandle),
      target: buildEdgePoint(targetHandle),
      targetHandle: buildEdgeTargetHandle(targetHandle),
    };
  });
}
