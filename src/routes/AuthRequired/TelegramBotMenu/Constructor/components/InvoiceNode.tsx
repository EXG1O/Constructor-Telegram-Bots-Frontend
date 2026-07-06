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

import { useInvoiceOffcanvasStore } from './InvoiceOffcanvas/store';
import Node from './Node';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import { DiagramInvoiceAPI, InvoiceAPI, InvoicesAPI } from 'api/telegram-bots/invoice';
import type { DiagramInvoice } from 'api/telegram-bots/invoice/types';
import fetchFile from 'api/utils/fetchFile';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  type EdgeHandle,
} from '../utils/edges';

export type NodeData = Omit<DiagramInvoice, 'x' | 'y' | 'source_connections'>;

export interface InvoiceNodeProps extends RFNodeProps<RFNode<NodeData, 'invoice'>> {}

function InvoiceNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: invoice,
}: InvoiceNodeProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.invoice',
  });

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditInvoiceOffcanvas = useInvoiceOffcanvasStore(
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
      retrieveAPICall: () => InvoiceAPI.get(telegramBotID, invoice.id),
      createAPICall: async ({ image, ...data }) =>
        InvoicesAPI.create(telegramBotID, {
          ...data,
          image: image
            ? {
                file:
                  image.url && image.name
                    ? await fetchFile(image.url, image.name)
                    : null,
                from_url: image.from_url,
              }
            : null,
        }),
      diagramAPICall: (id) => DiagramInvoiceAPI.get(telegramBotID, id),
    }),
    [invoice.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<typeof type>, 'position'> = {
    objectType: type,
    objectID: invoice.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await InvoiceAPI.delete(telegramBotID, invoice.id);

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
    showEditInvoiceOffcanvas(invoice.id);
  }

  return (
    <Node
      title={t('title')}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    >
      <Node.Block className='relative'>
        <Node.Title>{invoice.name}</Node.Title>
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

export default InvoiceNode;
