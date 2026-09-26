import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type Node as RFNode,
  type NodeProps as RFNodeProps,
  useReactFlow,
} from '@xyflow/react';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import Node from './Node';
import type { NodeHandleProps } from './Node/components/NodeHandle';
import { useTemporaryVariableOffcanvasStore } from './TemporaryVariableOffcanvas/store';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  ConnectionHandlePosition,
  type DiagramTemporaryVariable,
  TelegramBotsService,
  type TemporaryVariable,
} from 'api';

import type { NodeType } from '../enums';

export interface TemporaryVariableNodeProps extends RFNodeProps<
  RFNode<
    Omit<DiagramTemporaryVariable, 'x' | 'y' | 'source_connections'>,
    typeof NodeType.TemporaryVariable
  >
> {}

function TemporaryVariableNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: variable,
}: TemporaryVariableNodeProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'nodes.temporaryVariable' },
  );

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditTemporaryVariableOffcanvas = useTemporaryVariableOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate<TemporaryVariable>(
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
      retrieveAPICall: () =>
        TelegramBotsService.getTemporaryVariable({
          path: { telegramBotId: telegramBotID, id: variable.id },
        }),
      createAPICall: (data) =>
        TelegramBotsService.createTemporaryVariable({
          path: { telegramBotId: telegramBotID },
          body: data,
        }),
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramTemporaryVariable({
          path: { telegramBotId: telegramBotID, id },
        }),
    }),
    [variable.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const nodeHandlerProps: Pick<
    NodeHandleProps,
    'objectType' | 'objectID' | 'nestedObjectID'
  > = {
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

        const { error } = await TelegramBotsService.deleteTemporaryVariable({
          path: { telegramBotId: telegramBotID, id: variable.id },
        });

        if (error) {
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
          {...nodeHandlerProps}
          type='target'
          position={ConnectionHandlePosition.Left}
        />
        <Node.Handle
          {...nodeHandlerProps}
          type='source'
          position={ConnectionHandlePosition.Right}
        />
      </Node.Block>
      <Node.Block className='text-center'>{variable.value}</Node.Block>
    </Node>
  );
}

export default TemporaryVariableNode;
