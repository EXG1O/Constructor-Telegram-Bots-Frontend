import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type Node as RFNode,
  type NodeProps as RFNodeProps,
  useReactFlow,
} from '@xyflow/react';
import { Link } from 'lucide-react';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { telegramRichInputEditorInnerContentVariants } from 'components/shared/TelegramRichInputLayout';
import { richInputEditorInnerContentVariants } from 'components/ui/RichInput/components/RichInputEditor';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useMessageOffcanvasStore } from './MessageOffcanvas/store';
import Node from './Node';
import type { NodeHandleProps } from './Node/components/NodeHandle';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  ConnectionHandlePosition,
  type DiagramMessage,
  type Message,
  type MessageDocument,
  type MessageDocumentRequestWritable,
  type MessageImage,
  type MessageImageRequestWritable,
  TelegramBotsService,
} from 'api';
import fetchFile from 'api/utils/fetchFile';
import formDataBodySerializer from 'api/utils/formDataBodySerializer';

import cn from 'utils/cn';

import type { NodeType } from '../enums';
import { messageKeyboardButtonStyleVariants } from '../styles/messageKeyboardButtonStyle';

export interface MessageNodeProps extends RFNodeProps<
  RFNode<
    Omit<DiagramMessage, 'x' | 'y' | 'source_connections'>,
    typeof NodeType.Message
  >
> {}

function MessageNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: message,
}: MessageNodeProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'nodes.message' },
  );

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditMessageOffcanvas = useMessageOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate<Message>(
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
        TelegramBotsService.getMessage({
          path: { telegramBotId: telegramBotID, id: message.id },
        }),
      createAPICall: async ({ images, documents, ...data }) => {
        const processMedia = (media: (MessageImage | MessageDocument)[]) =>
          Promise.all(
            media.map<
              Promise<MessageImageRequestWritable | MessageDocumentRequestWritable>
            >(async ({ name, url, from_url, position }) => ({
              file: url && name ? await fetchFile(url, name) : null,
              from_url,
              position,
            })),
          );

        const [processedImages, processedDocuments] = await Promise.all([
          processMedia(images ?? []),
          processMedia(documents ?? []),
        ]);

        return TelegramBotsService.createMessage({
          ...formDataBodySerializer,
          path: { telegramBotId: telegramBotID },
          body: {
            ...data,
            images: processedImages,
            documents: processedDocuments,
          },
        });
      },
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramMessage({
          path: { telegramBotId: telegramBotID, id },
        }),
    }),
    [message.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const nodeHandlerProps: Pick<NodeHandleProps, 'objectType' | 'objectID'> = {
    objectType: type,
    objectID: message.id,
  };

  function handleEdit(): void {
    showEditMessageOffcanvas(message.id);
  }

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const { error } = await TelegramBotsService.deleteMessage({
          path: { telegramBotId: telegramBotID, id: message.id },
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

  return (
    <Node
      title={t('title')}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    >
      <Node.Block className='relative'>
        <Node.Title>{message.name}</Node.Title>
        <Node.Handle
          {...nodeHandlerProps}
          type='target'
          nestedObjectID={0}
          position={ConnectionHandlePosition.Left}
        />
        <Node.Handle
          {...nodeHandlerProps}
          type='source'
          nestedObjectID={0}
          position={ConnectionHandlePosition.Right}
        />
      </Node.Block>
      {message.text && (
        <Node.Block
          className={cn(
            richInputEditorInnerContentVariants({ size: 'sm' }),
            telegramRichInputEditorInnerContentVariants({ size: 'sm' }),
          )}
          dangerouslySetInnerHTML={{
            __html: message.text.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '<$1><br></$1>'),
          }}
        />
      )}
      {message.keyboard?.buttons && (
        <div className='flex flex-col gap-1'>
          {message.keyboard.buttons
            .sort((a, b) => (a.row !== b.row ? a.row - b.row : a.position - b.position))
            .map((button) =>
              button.url ? (
                <Node.Block
                  key={button.id}
                  variant={null}
                  className={cn(
                    'flex',
                    'flex-wrap',
                    'items-center',
                    'justify-center',
                    'gap-1',
                    'wrap-anywhere',
                    messageKeyboardButtonStyleVariants({ style: button.style }),
                  )}
                >
                  {button.text}
                  <Link className='size-3' />
                </Node.Block>
              ) : (
                <Node.Block
                  key={button.id}
                  variant={null}
                  className={cn(
                    'relative',
                    'text-center',
                    messageKeyboardButtonStyleVariants({ style: button.style }),
                  )}
                >
                  {button.text}
                  <Node.Handle
                    {...nodeHandlerProps}
                    type='source'
                    nestedObjectID={button.id}
                    position={ConnectionHandlePosition.Left}
                  />
                  <Node.Handle
                    {...nodeHandlerProps}
                    type='source'
                    nestedObjectID={button.id}
                    position={ConnectionHandlePosition.Right}
                  />
                </Node.Block>
              ),
            )}
        </div>
      )}
    </Node>
  );
}

export default MessageNode;
