import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import type { makeRequest } from 'api/core';
import type { DiagramBlock } from 'api/telegram-bots/base/types';

import { convertDiagramBlockToNode, type NodeType } from '../../../utils/nodes';

export interface NodeDuplicateOptions<BlockType extends Record<string, any>> {
  title: string;
  text: string;
  messages: {
    success: string;
    error: string;
  };
  type: NodeType;
  suffix?: string;
  retrieveAPICall: () => ReturnType<typeof makeRequest<BlockType>>;
  createAPICall: (
    data: Omit<BlockType, 'id'>,
  ) => ReturnType<typeof makeRequest<BlockType>>;
  diagramAPICall: (id: number) => ReturnType<typeof makeRequest<DiagramBlock>>;
}

function useNodeDuplicate<BlockType extends Record<string, any>>(
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
      type,
      suffix,
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

        const { id, ...data } = retrieveResponse.json;

        const createResponse = await createAPICall({
          ...data,
          name: data.name + (suffix ?? ' (Duplicate)'),
        });
        if (!createResponse.ok) return handleError();

        const diagramResponse = await diagramAPICall(createResponse.json.id);
        if (!diagramResponse.ok) return handleError();

        reactFlow.addNodes(convertDiagramBlockToNode(type, diagramResponse.json));
        hideConfirmModal();
        createMessageToast({ message: messages.success, level: 'success' });
      },
      onCancel: null,
    });
  }, [deps]);
}

export default useNodeDuplicate;
