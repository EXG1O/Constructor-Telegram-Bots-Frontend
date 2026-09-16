import React, { type ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  type Node as RFNode,
  type NodeProps as RFNodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import Node from './Node';
import { useTimerOffcanvasStore } from './TimerOffcanvas/store';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import { DiagramTimerAPI, TimerAPI, TimersAPI } from 'api/telegram-bots/timer';
import type { DiagramTimer } from 'api/telegram-bots/timer/types';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  type EdgeHandle,
} from '../utils/edges';

export type NodeData = Omit<DiagramTimer, 'x' | 'y' | 'source_connections'>;

export interface TimerNodeProps extends RFNodeProps<RFNode<NodeData, 'timer'>> {}

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
      x: positionAbsoluteX,
      y: positionAbsoluteY,
      retrieveAPICall: () => TimerAPI.get({ botID, id: timer.id }),
      createAPICall: (data) => TimersAPI.create({ botID, data }),
      diagramAPICall: (id) => DiagramTimerAPI.get({ botID, id }),
    }),
    [botID, timer.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<typeof type>, 'position'> = {
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

        const response = await TimerAPI.delete({ botID, id: timer.id });

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
