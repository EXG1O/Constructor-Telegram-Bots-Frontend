import { Node } from '@xyflow/react';

import { nodeTypes } from '..';

import { DiagramBlock } from 'api/telegram-bots/diagram/types';

export type NodeType = keyof typeof nodeTypes;

export interface NodeID {
  type: NodeType;
  id: number;
}

export function parseNodeID(nodeID: string): NodeID {
  const [type, id] = nodeID.split(':');
  return { type, id: parseInt(id) } as any;
}

export function buildNodeID(nodeID: NodeID): string {
  return [nodeID.type, nodeID.id].join(':');
}

export function convertDiagramBlockToNode(
  type: NodeType,
  { x, y, source_connections, ...diagramBlock }: DiagramBlock & Record<string, any>,
): Node {
  return {
    id: buildNodeID({ type, id: diagramBlock.id }),
    type,
    position: { x, y },
    data: diagramBlock,
  };
}
