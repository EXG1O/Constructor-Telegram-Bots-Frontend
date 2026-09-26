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

import { useConditionOffcanvasStore } from './ConditionOffcanvas/store';
import Node from './Node';
import type { NodeHandleProps } from './Node/components/NodeHandle';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  type Condition,
  ConnectionHandlePosition,
  type DiagramCondition,
  TelegramBotsService,
} from 'api';

import type { NodeType } from '../enums';

export interface ConditionNodeProps extends RFNodeProps<
  RFNode<
    Omit<DiagramCondition, 'x' | 'y' | 'source_connections'>,
    typeof NodeType.Condition
  >
> {}

function ConditionNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: condition,
}: ConditionNodeProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'nodes.condition' },
  );

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditConditionOffcanvas = useConditionOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate<Condition>(
    () => ({
      title: t('duplicateModal.title'),
      text: t('duplicateModal.text'),
      messages: {
        success: t('messages.duplicate.success'),
        error: t('messages.duplicate.error'),
      },
      nodeID: id,
      type,
      x: positionAbsoluteX,
      y: positionAbsoluteY,
      retrieveAPICall: () =>
        TelegramBotsService.getCondition({
          path: { telegramBotId: telegramBotID, id: condition.id },
        }),
      createAPICall: (data) =>
        TelegramBotsService.createCondition({
          path: { telegramBotId: telegramBotID },
          body: data,
        }),
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramCondition({
          path: { telegramBotId: telegramBotID, id },
        }),
    }),
    [condition.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const nodeHandlerProps: Pick<
    NodeHandleProps,
    'objectType' | 'objectID' | 'nestedObjectID'
  > = {
    objectType: type,
    objectID: condition.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const { error } = await TelegramBotsService.deleteCondition({
          path: { telegramBotId: telegramBotID, id: condition.id },
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
    showEditConditionOffcanvas(condition.id);
  }

  return (
    <Node
      title={t('title')}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    >
      <Node.Block className='relative'>
        <Node.Title>{condition.name}</Node.Title>
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
    </Node>
  );
}

export default ConditionNode;
