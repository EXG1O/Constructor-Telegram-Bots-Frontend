import type { Node } from '@xyflow/react';

import type { DiagramBlock } from 'api';

import type { NodeType } from '../enums';

export interface NodeID {
  type: NodeType;
  id: number;
}

export function parseNodeID(nodeID: string): NodeID {
  const [type, id] = nodeID.split(':');
  return { type: type as NodeType, id: Number(id) };
}

export function buildNodeID(nodeID: NodeID): string {
  return [nodeID.type, nodeID.id].join(':');
}

export function convertDiagramBlockToNode(
  type: NodeType,
  {
    x = 0,
    y = 0,
    source_connections: _source_connections,
    ...diagramBlock
  }: DiagramBlock,
): Node {
  return {
    id: buildNodeID({ type, id: diagramBlock.id }),
    type,
    position: { x, y },
    data: diagramBlock,
  };
}
