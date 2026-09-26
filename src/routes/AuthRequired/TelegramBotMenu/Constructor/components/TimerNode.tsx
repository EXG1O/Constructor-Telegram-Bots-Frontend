import React, { type ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
import { useTimerOffcanvasStore } from './TimerOffcanvas/store';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  ConnectionHandlePosition,
  type DiagramTimer,
  TelegramBotsService,
  type Timer,
} from 'api';

import type { NodeType } from '../enums';

export interface TimerNodeProps extends RFNodeProps<
  RFNode<Omit<DiagramTimer, 'x' | 'y' | 'source_connections'>, typeof NodeType.Timer>
> {}

function TimerNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: timer,
}: TimerNodeProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'nodes.timer' },
  );

  const reactFlow = useReactFlow();

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditTimerOffcanvas = useTimerOffcanvasStore((state) => state.showOffcanvas);

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate<Timer>(
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
        TelegramBotsService.getTimer({ path: { telegramBotId: botID, id: timer.id } }),
      createAPICall: (data) =>
        TelegramBotsService.createTimer({ path: { telegramBotId: botID }, body: data }),
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramTimer({ path: { telegramBotId: botID, id } }),
    }),
    [botID, timer.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const nodeHandlerProps: Pick<
    NodeHandleProps,
    'objectType' | 'objectID' | 'nestedObjectID'
  > = {
    objectType: type,
    objectID: timer.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const { error } = await TelegramBotsService.deleteTimer({
          path: { telegramBotId: botID, id: timer.id },
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
    showEditTimerOffcanvas(timer.id);
  }

  return (
    <Node
      title={t('title')}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    >
      <Node.Block className='relative'>
        <Node.Title>{timer.name}</Node.Title>
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
      <Node.Block>
        <Trans
          t={t}
          i18nKey='duration'
          values={{ value: timer.duration_seconds }}
          components={{ bold: <strong /> }}
        />
      </Node.Block>
    </Node>
  );
}

export default TimerNode;
