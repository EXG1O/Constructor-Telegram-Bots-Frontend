import { useCallback } from 'react';
import { type Node, useReactFlow } from '@xyflow/react';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import type { Block, DiagramBlock } from 'api';
import type { RequestResult } from 'api/client/client';

import type { NodeType } from '../../../enums';
import { convertDiagramBlockToNode } from '../../../utils/nodes';

export interface NodeDuplicateOptions<TBlock extends Block> {
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
  retrieveAPICall: () => RequestResult<{ 200: TBlock }, any, false>;
  createAPICall: (data: TBlock) => RequestResult<{ 201: TBlock }, any, false>;
  diagramAPICall: (id: number) => RequestResult<{ 200: DiagramBlock }, any, false>;
}

function useNodeDuplicate<TBlock extends Block>(
  factory: () => NodeDuplicateOptions<TBlock>,
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

        const retrieveResult = await retrieveAPICall();
        if (retrieveResult.error || !retrieveResult.data) return handleError();

        const createResult = await createAPICall({
          ...retrieveResult.data,
          name: retrieveResult.data.name + (suffix ?? ' (Duplicate)'),
          x: x + 50,
          y: y + 50,
        });
        if (createResult.error || !createResult.data) return handleError();

        const diagramResult = await diagramAPICall(createResult.data.id);
        if (diagramResult.error || !diagramResult.data) return handleError();

        const newNode: Node = convertDiagramBlockToNode(type, diagramResult.data);

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
