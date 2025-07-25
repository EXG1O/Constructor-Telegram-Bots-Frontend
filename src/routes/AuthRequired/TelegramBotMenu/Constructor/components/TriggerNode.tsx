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

import Node from './Node';
import { useTriggerOffcanvasStore } from './TriggerOffcanvas/store';

import { DiagramBlock } from 'api/telegram-bots/diagram/types';
import { TriggerAPI } from 'api/telegram-bots/trigger';
import { DiagramTrigger } from 'api/telegram-bots/trigger/types';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  EdgeHandle,
} from '../utils/edges';

type Data = Omit<DiagramTrigger, keyof DiagramBlock>;

export interface TriggerNodeProps extends RFNodeProps<RFNode<Data>> {}

function TriggerNode({ id, type, data: trigger }: TriggerNodeProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.trigger',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const reactFlow = useReactFlow();

  const showEditTriggerOffcanvas = useTriggerOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<any>, 'position'> = {
    objectType: type,
    objectID: trigger.id,
    nestedObjectID: 0,
  };

  function handleEdit(): void {
    showEditTriggerOffcanvas(trigger.id);
  }

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await TriggerAPI.delete(telegramBot.id, trigger.id);

        if (response.ok) {
          reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
          hideConfirmModal();
          createMessageToast({
            message: t('messages.deleteTrigger.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('messages.deleteTrigger.error'),
            level: 'error',
          });
        }

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  return (
    <Node title={t('title')} onEdit={handleEdit} onDelete={handleDelete}>
      <Node.Block className='relative'>
        <Node.Title>{trigger.name}</Node.Title>
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
    </Node>
  );
}

export default TriggerNode;
