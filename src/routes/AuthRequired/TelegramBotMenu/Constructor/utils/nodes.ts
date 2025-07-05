import { Node } from '@xyflow/react';

import { nodeTypes } from '..';

import { DiagramBlock } from 'api/telegram_bots/types';

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

export interface ExistingDiagramBlock
  extends Omit<DiagramBlock, 'source_connections' | 'target_connections'>,
    Partial<Pick<DiagramBlock, 'source_connections' | 'target_connections'>>,
    Record<string, any> {
  id: number;
}

export function convertDiagramBlockToNode(
  type: NodeType,
  {
    x,
    y,
    source_connections,
    target_connections,
    ...diagramBlock
  }: ExistingDiagramBlock,
): Node {
  return {
    id: buildNodeID({ type, id: diagramBlock.id }),
    type,
    position: { x, y },
    data: diagramBlock,
  };
}
