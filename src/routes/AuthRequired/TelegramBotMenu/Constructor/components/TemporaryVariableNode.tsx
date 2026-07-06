import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type Node as RFNode,
  type NodeProps as RFNodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import Node from './Node';
import { useTemporaryVariableOffcanvasStore } from './TemporaryVariableOffcanvas/store';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  DiagramTemporaryVariableAPI,
  TemporaryVariableAPI,
  TemporaryVariablesAPI,
} from 'api/telegram-bots/temporary-variable';
import type { DiagramTemporaryVariable } from 'api/telegram-bots/temporary-variable/types';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  type EdgeHandle,
} from '../utils/edges';

export type NodeData = Omit<DiagramTemporaryVariable, 'x' | 'y' | 'source_connections'>;

export interface TemporaryVariableNodeProps extends RFNodeProps<
  RFNode<NodeData, 'temporary_variable'>
> {}

function TemporaryVariableNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: variable,
}: TemporaryVariableNodeProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.temporaryVariable',
  });

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditTemporaryVariableOffcanvas = useTemporaryVariableOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate(
    () => ({
      title: t('duplicateModal.title'),
      text: t('duplicateModal.text'),
      messages: {
        success: t('messages.duplicate.success'),
        error: t('messages.duplicate.error'),
      },
      nodeID: id,
      type,
      suffix: '_DUPLICATE',
      x: positionAbsoluteX,
      y: positionAbsoluteY,
      retrieveAPICall: () => TemporaryVariableAPI.get(telegramBotID, variable.id),
      createAPICall: (data) => TemporaryVariablesAPI.create(telegramBotID, data),
      diagramAPICall: (id) => DiagramTemporaryVariableAPI.get(telegramBotID, id),
    }),
    [variable.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<typeof type>, 'position'> = {
    objectType: type,
    objectID: variable.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await TemporaryVariableAPI.delete(telegramBotID, variable.id);

        if (!response.ok) {
          createMessageToast({
            message: t('messages.delete.error'),
            level: 'error',
          });
          setLoadingConfirmModal(false);
          return;
        }

        reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
        hideConfirmModal();
        createMessageToast({
          message: t('messages.delete.success'),
          level: 'success',
        });
      },
      onCancel: null,
    });
  }

  function handleEdit(): void {
    showEditTemporaryVariableOffcanvas(variable.id);
  }

  return (
    <Node
      title={t('title')}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    >
      <Node.Block className='relative'>
        <Node.Title>{variable.name}</Node.Title>
        <Node.Handle
          id={buildEdgeTargetHandle({
            ...defaultEdgeHandleBuildParams,
            position: 'left',
          })}
          type='target'
          position={Position.Left}
        />
        <Node.Handle
          id={buildEdgeSourceHandle({
            ...defaultEdgeHandleBuildParams,
            position: 'right',
          })}
          type='source'
          position={Position.Right}
        />
      </Node.Block>
      <Node.Block className='text-center'>{variable.value}</Node.Block>
    </Node>
  );
}

export default TemporaryVariableNode;
