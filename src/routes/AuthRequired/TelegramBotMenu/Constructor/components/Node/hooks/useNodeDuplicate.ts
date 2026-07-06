import { useCallback } from 'react';
import { type Node, useReactFlow } from '@xyflow/react';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import type { makeRequest } from 'api/core';
import type { Block, CreateBlock, DiagramBlock } from 'api/telegram-bots/base/types';

import { convertDiagramBlockToNode, type NodeType } from '../../../utils/nodes';

export interface NodeDuplicateOptions<BlockType extends Block> {
  title: string;
  text: string;
  messages: {
    success: string;
    error: string;
  };
  nodeID: string;
  type: NodeType;
  suffix?: string;
  x: number;
  y: number;
  retrieveAPICall: () => ReturnType<typeof makeRequest<BlockType>>;
  createAPICall: (
    data: Required<CreateBlock> & BlockType,
  ) => ReturnType<typeof makeRequest<BlockType>>;
  diagramAPICall: (id: number) => ReturnType<typeof makeRequest<DiagramBlock>>;
}

function useNodeDuplicate<BlockType extends Block>(
  factory: () => NodeDuplicateOptions<BlockType>,
  deps: React.DependencyList,
): () => void {
  const reactFlow = useReactFlow();

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  return useCallback(() => {
    const {
      title,
      text,
      messages,
      nodeID,
      type,
      suffix,
      x,
      y,
      retrieveAPICall,
      createAPICall,
      diagramAPICall,
    } = factory();

    showConfirmModal({
      title,
      text,
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const handleError = () => {
          setLoadingConfirmModal(false);
          createMessageToast({ message: messages.error, level: 'error' });
        };

        const retrieveResponse = await retrieveAPICall();
        if (!retrieveResponse.ok) return handleError();

        const { id, name, ...rest } = retrieveResponse.json;
        const data: Required<CreateBlock> = {
          ...rest,
          name: name + (suffix ?? ' (Duplicate)'),
          x: x + 50,
          y: y + 50,
        };

        const createResponse = await createAPICall(data as any);
        if (!createResponse.ok) return handleError();

        const diagramResponse = await diagramAPICall(createResponse.json.id);
        if (!diagramResponse.ok) return handleError();

        const newNode: Node = convertDiagramBlockToNode(type, diagramResponse.json);

        reactFlow.addNodes(newNode);
        reactFlow.fitView({
          maxZoom: Math.max(1, reactFlow.getZoom()),
          duration: 450,
          nodes: [{ id: nodeID }, newNode],
        });

        hideConfirmModal();
        createMessageToast({ message: messages.success, level: 'success' });
      },
      onCancel: null,
    });
  }, deps);
}

export default useNodeDuplicate;
