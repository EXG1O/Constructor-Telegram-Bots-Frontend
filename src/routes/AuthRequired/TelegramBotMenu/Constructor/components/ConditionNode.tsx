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

import { useConditionOffcanvasStore } from './ConditionOffcanvas/store';
import Node from './Node';

import { ConditionAPI } from 'api/telegram-bots/condition';
import { DiagramCondition } from 'api/telegram-bots/condition/types';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  EdgeHandle,
} from '../utils/edges';

type Data = Omit<DiagramCondition, 'x' | 'y' | 'source_connections'>;

export interface ConditionNodeProps extends RFNodeProps<RFNode<Data>> {}

function ConditionNode({
  id,
  type,
  data: condition,
}: ConditionNodeProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.condition',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const reactFlow = useReactFlow();

  const showEditConditionOffcanvas = useConditionOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<any>, 'position'> = {
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

        const response = await ConditionAPI.delete(telegramBot.id, condition.id);

        if (response.ok) {
          reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
          hideConfirmModal();
          createMessageToast({
            message: t('messages.deleteCondition.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('messages.deleteCondition.error'),
            level: 'error',
          });
        }

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  function handleEdit(): void {
    showEditConditionOffcanvas(condition.id);
  }

  return (
    <Node title={t('title')} onEdit={handleEdit} onDelete={handleDelete}>
      <Node.Block className='relative'>
        <Node.Title>{condition.name}</Node.Title>
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

export default ConditionNode;
