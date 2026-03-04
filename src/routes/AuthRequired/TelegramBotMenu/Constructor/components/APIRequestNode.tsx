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

import { useAPIRequestOffcanvasStore } from './APIRequestOffcanvas/store';
import Node from './Node';

import { APIRequestAPI } from 'api/telegram-bots/api-request';
import type { DiagramAPIRequest } from 'api/telegram-bots/api-request/types';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  type EdgeHandle,
} from '../utils/edges';

type Data = Omit<DiagramAPIRequest, 'x' | 'y' | 'source_connections'>;

export interface APIRequestNodeProps extends RFNodeProps<RFNode<Data>> {}

function APIRequestNode({
  id,
  type,
  data: request,
}: APIRequestNodeProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.apiRequest',
  });

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditAPIRequestOffcanvas = useAPIRequestOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<any>, 'position'> = {
    objectType: type,
    objectID: request.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await APIRequestAPI.delete(telegramBotID, request.id);

        if (response.ok) {
          reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
          hideConfirmModal();
          createMessageToast({
            message: t('messages.deleteAPIRequest.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('messages.deleteAPIRequest.error'),
            level: 'error',
          });
        }

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  function handleEdit(): void {
    showEditAPIRequestOffcanvas(request.id);
  }

  return (
    <Node title={t('title')} onEdit={handleEdit} onDelete={handleDelete}>
      <Node.Block className='relative'>
        <Node.Title>{request.name}</Node.Title>
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

export default APIRequestNode;
