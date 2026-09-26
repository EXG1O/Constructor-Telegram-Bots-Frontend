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

import { useBackgroundTaskOffcanvasStore } from './BackgroundTaskOffcanvas/store';
import Node from './Node';
import type { NodeHandleProps } from './Node/components/NodeHandle';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  type BackgroundTask,
  ConnectionHandlePosition,
  type DiagramBackgroundTask,
  TelegramBotsService,
} from 'api';

import type { NodeType } from '../enums';

export interface BackgroundTaskNodeProps extends RFNodeProps<
  RFNode<
    Omit<DiagramBackgroundTask, 'x' | 'y' | 'source_connections'>,
    typeof NodeType.BackgroundTask
  >
> {}

const NODE_PREFIX: string = 'nodes.backgroundTask';
const OFFCANVAS_PREFIX: string = 'backgroundTaskOffcanvas';

function BackgroundTaskNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: task,
}: BackgroundTaskNodeProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
  );

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditBackgroundTaskOffcanvas = useBackgroundTaskOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate<BackgroundTask>(
    () => ({
      title: t(`${NODE_PREFIX}.duplicateModal.title`),
      text: t(`${NODE_PREFIX}.duplicateModal.text`),
      messages: {
        success: t(`${NODE_PREFIX}.messages.duplicate.success`),
        error: t(`${NODE_PREFIX}.messages.duplicate.error`),
      },
      nodeID: id,
      type,
      x: positionAbsoluteX,
      y: positionAbsoluteY,
      retrieveAPICall: () =>
        TelegramBotsService.getBackgroundTask({
          path: { telegramBotId: telegramBotID, id: task.id },
        }),
      createAPICall: (data) =>
        TelegramBotsService.createBackgroundTask({
          path: { telegramBotId: telegramBotID },
          body: data,
        }),
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramBackgroundTask({
          path: { telegramBotId: telegramBotID, id },
        }),
    }),
    [task.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const nodeHandlerProps: Pick<
    NodeHandleProps,
    'objectType' | 'objectID' | 'nestedObjectID'
  > = {
    objectType: type,
    objectID: task.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t(`${NODE_PREFIX}.deleteModal.title`),
      text: t(`${NODE_PREFIX}.deleteModal.text`),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const { error } = await TelegramBotsService.deleteBackgroundTask({
          path: { telegramBotId: telegramBotID, id: task.id },
        });

        if (error) {
          createMessageToast({
            message: t(`${NODE_PREFIX}.messages.delete.error`),
            level: 'error',
          });
          setLoadingConfirmModal(false);
          return;
        }

        reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
        hideConfirmModal();
        createMessageToast({
          message: t(`${NODE_PREFIX}.messages.delete.success`),
          level: 'success',
        });
      },
      onCancel: null,
    });
  }

  function handleEdit(): void {
    showEditBackgroundTaskOffcanvas(task.id);
  }

  return (
    <Node
      title={t(`${NODE_PREFIX}.title`)}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    >
      <Node.Block className='relative'>
        <Node.Title>{task.name}</Node.Title>
        <Node.Handle
          {...nodeHandlerProps}
          type='source'
          position={ConnectionHandlePosition.Left}
        />
        <Node.Handle
          {...nodeHandlerProps}
          type='source'
          position={ConnectionHandlePosition.Right}
        />
      </Node.Block>
      <Node.Block>
        <strong>{`${t(`${NODE_PREFIX}.interval`)}:`}</strong>{' '}
        {t(`${OFFCANVAS_PREFIX}.intervalBlock.select.${task.interval}`)}
      </Node.Block>
    </Node>
  );
}

export default BackgroundTaskNode;
