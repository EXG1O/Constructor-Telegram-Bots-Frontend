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

import { useDatabaseOperationOffcanvasStore } from './DatabaseOperationOffcanvas/store';
import Node from './Node';

import { DatabaseOperationAPI } from 'api/telegram-bots/database-operation';
import { DiagramDatabaseOperation } from 'api/telegram-bots/database-operation/types';
import { DiagramBlock } from 'api/telegram-bots/diagram/types';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  EdgeHandle,
} from '../utils/edges';

type Data = Omit<DiagramDatabaseOperation, keyof DiagramBlock>;

export interface DatabaseOperationNodeProps extends RFNodeProps<RFNode<Data>> {}

function DatabaseOperationNode({
  id,
  type,
  data: operation,
}: DatabaseOperationNodeProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.databaseOperation',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const reactFlow = useReactFlow();

  const showEditDatabaseOperationOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<any>, 'position'> = {
    objectType: type,
    objectID: operation.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await DatabaseOperationAPI.delete(
          telegramBot.id,
          operation.id,
        );

        if (response.ok) {
          reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
          hideConfirmModal();
          createMessageToast({
            message: t('messages.deleteDatabaseOperation.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('messages.deleteDatabaseOperation.error'),
            level: 'error',
          });
        }

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  function handleEdit(): void {
    showEditDatabaseOperationOffcanvas(operation.id);
  }

  return (
    <Node title={t('title')} onEdit={handleEdit} onDelete={handleDelete}>
      <Node.Block className='relative'>
        <Node.Title>{operation.name}</Node.Title>
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

export default DatabaseOperationNode;
