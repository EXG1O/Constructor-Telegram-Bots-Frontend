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

import { useConditionOffcanvasStore } from './ConditionOffcanvas/store';
import Node from './Node';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  ConditionAPI,
  ConditionsAPI,
  DiagramConditionAPI,
} from 'api/telegram-bots/condition';
import type { DiagramCondition } from 'api/telegram-bots/condition/types';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  type EdgeHandle,
} from '../utils/edges';

type Data = Omit<DiagramCondition, 'x' | 'y' | 'source_connections'>;

export interface ConditionNodeProps extends RFNodeProps<RFNode<Data, 'condition'>> {}

function ConditionNode({
  id,
  type,
  data: condition,
}: ConditionNodeProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.condition',
  });

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditConditionOffcanvas = useConditionOffcanvasStore(
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
      type,
      retrieveAPICall: () => ConditionAPI.get(telegramBotID, condition.id),
      createAPICall: (data) => ConditionsAPI.create(telegramBotID, data),
      diagramAPICall: (id) => DiagramConditionAPI.get(telegramBotID, id),
    }),
    [condition.id, i18n.language],
  );

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<typeof type>, 'position'> = {
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

        const response = await ConditionAPI.delete(telegramBotID, condition.id);

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
