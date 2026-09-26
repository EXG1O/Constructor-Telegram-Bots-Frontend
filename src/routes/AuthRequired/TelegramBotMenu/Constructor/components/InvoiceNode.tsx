import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type Node as RFNode,
  type NodeProps as RFNodeProps,
  useReactFlow,
} from '@xyflow/react';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useInvoiceOffcanvasStore } from './InvoiceOffcanvas/store';
import Node from './Node';
import type { NodeHandleProps } from './Node/components/NodeHandle';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  ConnectionHandlePosition,
  type DiagramInvoice,
  type Invoice,
  TelegramBotsService,
} from 'api';
import fetchFile from 'api/utils/fetchFile';
import formDataBodySerializer from 'api/utils/formDataBodySerializer';

import type { NodeType } from '../enums';

export interface InvoiceNodeProps extends RFNodeProps<
  RFNode<
    Omit<DiagramInvoice, 'x' | 'y' | 'source_connections'>,
    typeof NodeType.Invoice
  >
> {}

function InvoiceNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: invoice,
}: InvoiceNodeProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'nodes.invoice' },
  );

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditInvoiceOffcanvas = useInvoiceOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate<Invoice>(
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
      retrieveAPICall: () =>
        TelegramBotsService.getInvoice({
          path: { telegramBotId: telegramBotID, id: invoice.id },
        }),
      createAPICall: async ({ image, ...data }) =>
        TelegramBotsService.createInvoice({
          ...formDataBodySerializer,
          path: { telegramBotId: telegramBotID },
          body: {
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
          },
        }),
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramInvoice({
          path: { telegramBotId: telegramBotID, id },
        }),
    }),
    [invoice.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const nodeHandlerProps: Pick<
    NodeHandleProps,
    'objectType' | 'objectID' | 'nestedObjectID'
  > = {
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

        const { error } = await TelegramBotsService.deleteInvoice({
          path: { telegramBotId: telegramBotID, id: invoice.id },
        });

        if (error) {
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
          {...nodeHandlerProps}
          type='target'
          position={ConnectionHandlePosition.Left}
        />
        <Node.Handle
          {...nodeHandlerProps}
          type='source'
          position={ConnectionHandlePosition.Right}
        />
      </Node.Block>
    </Node>
  );
}

export default InvoiceNode;
