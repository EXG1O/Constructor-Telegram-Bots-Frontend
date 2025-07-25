import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Node as RFNode,
  NodeProps as RFNodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useBackgroundTaskOffcanvasStore } from './BackgroundTaskOffcanvas/store';
import Node from './Node';

import { BackgroundTaskAPI } from 'api/telegram-bots/background-task';
import { DiagramBackgroundTask } from 'api/telegram-bots/background-task/types';
import { DiagramBlock } from 'api/telegram-bots/diagram/types';

import { buildEdgeSourceHandle, EdgeHandle } from '../utils/edges';

type Data = Omit<DiagramBackgroundTask, keyof DiagramBlock>;

export interface BackgroundTaskNodeProps extends RFNodeProps<RFNode<Data>> {}

const NODE_PREFIX: string = 'nodes.backgroundTask';
const OFFCANVAS_PREFIX: string = 'backgroundTaskOffcanvas';

function BackgroundTaskNode({
  id,
  type,
  data: task,
}: BackgroundTaskNodeProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const reactFlow = useReactFlow();

  const showEditBackgroundTaskOffcanvas = useBackgroundTaskOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<any>, 'position'> = {
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

        const response = await BackgroundTaskAPI.delete(telegramBot.id, task.id);

        if (response.ok) {
          reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
          hideConfirmModal();
          createMessageToast({
            message: t(`${NODE_PREFIX}.messages.deleteBackgroundTask.success`),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t(`${NODE_PREFIX}.messages.deleteBackgroundTask.error`),
            level: 'error',
          });
        }

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  function handleEdit(): void {
    showEditBackgroundTaskOffcanvas(task.id);
  }

  return (
    <Node title={t(`${NODE_PREFIX}.title`)} onEdit={handleEdit} onDelete={handleDelete}>
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
