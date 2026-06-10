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

import { useBackgroundTaskOffcanvasStore } from './BackgroundTaskOffcanvas/store';
import Node from './Node';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  BackgroundTaskAPI,
  BackgroundTasksAPI,
  DiagramBackgroundTaskAPI,
} from 'api/telegram-bots/background-task';
import type { DiagramBackgroundTask } from 'api/telegram-bots/background-task/types';

import { buildEdgeSourceHandle, type EdgeHandle } from '../utils/edges';

type Data = Omit<DiagramBackgroundTask, 'x' | 'y' | 'source_connections'>;

export interface BackgroundTaskNodeProps extends RFNodeProps<
  RFNode<Data, 'background_task'>
> {}

const NODE_PREFIX: string = 'nodes.backgroundTask';
const OFFCANVAS_PREFIX: string = 'backgroundTaskOffcanvas';

function BackgroundTaskNode({
  id,
  type,
  data: task,
}: BackgroundTaskNodeProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditBackgroundTaskOffcanvas = useBackgroundTaskOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate(
    () => ({
      title: t(`${NODE_PREFIX}.duplicateModal.title`),
      text: t(`${NODE_PREFIX}.duplicateModal.text`),
      messages: {
        success: t(`${NODE_PREFIX}.messages.duplicate.success`),
        error: t(`${NODE_PREFIX}.messages.duplicate.error`),
      },
      type,
      retrieveAPICall: () => BackgroundTaskAPI.get(telegramBotID, task.id),
      createAPICall: (data) => BackgroundTasksAPI.create(telegramBotID, data),
      diagramAPICall: (id) => DiagramBackgroundTaskAPI.get(telegramBotID, id),
    }),
    [task.id, i18n.language],
  );

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<typeof type>, 'position'> = {
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

        const response = await BackgroundTaskAPI.delete(telegramBotID, task.id);

        if (!response.ok) {
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
          id={buildEdgeSourceHandle({
            ...defaultEdgeHandleBuildParams,
            position: 'left',
          })}
          type='source'
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
      <Node.Block>
        <strong>{`${t(`${NODE_PREFIX}.interval`)}:`}</strong>{' '}
        {t(`${OFFCANVAS_PREFIX}.intervalBlock.select.${task.interval}`)}
      </Node.Block>
    </Node>
  );
}

export default BackgroundTaskNode;
