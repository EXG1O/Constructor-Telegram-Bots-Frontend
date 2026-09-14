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
import { useRandomizerOffcanvasStore } from './RandomizerOffcanvas/store';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  DiagramRandomizerAPI,
  RandomizerAPI,
  RandomizersAPI,
} from 'api/telegram-bots/randomizer';
import type { DiagramRandomizer } from 'api/telegram-bots/randomizer/types';

import { buildEdgeSourceHandle, type EdgeHandle } from '../utils/edges';

export type NodeData = Omit<DiagramRandomizer, 'x' | 'y' | 'source_connections'>;

export interface RandomizerNodeProps extends RFNodeProps<
  RFNode<NodeData, 'randomizer'>
> {}

function RandomizerNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: task,
}: RandomizerNodeProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.randomizer',
  });

  const reactFlow = useReactFlow();

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditRandomizerOffcanvas = useRandomizerOffcanvasStore(
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
      x: positionAbsoluteX,
      y: positionAbsoluteY,
      retrieveAPICall: () => RandomizerAPI.get({ botID, id: task.id }),
      createAPICall: (data) => RandomizersAPI.create({ botID, data }),
      diagramAPICall: (id) => DiagramRandomizerAPI.get({ botID, id }),
    }),
    [task.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<typeof type>, 'position'> = {
    objectType: type,
    objectID: task.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await RandomizerAPI.delete({ botID, id: task.id });

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
    showEditRandomizerOffcanvas(task.id);
  }

  return (
    <Node
      title={t('title')}
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
    </Node>
  );
}

export default RandomizerNode;
