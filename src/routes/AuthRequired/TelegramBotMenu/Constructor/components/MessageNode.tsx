import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type Node as RFNode,
  type NodeProps as RFNodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { Link } from 'lucide-react';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { telegramRichInputEditorInnerContentVariants } from 'components/shared/TelegramRichInputLayout';
import { richInputEditorInnerContentVariants } from 'components/ui/RichInput/components/RichInputEditor';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useMessageOffcanvasStore } from './MessageOffcanvas/store';
import Node from './Node';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import { DiagramMessageAPI, MessageAPI, MessagesAPI } from 'api/telegram-bots/message';
import type {
  Data,
  DiagramMessage,
  MessageDocument,
  MessageImage,
} from 'api/telegram-bots/message/types';
import fetchFile from 'api/utils/fetchFile';

import cn from 'utils/cn';

import { messageKeyboardButtonStyleVariants } from '../styles/messageKeyboardButtonStyle';
import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  type EdgeHandle,
} from '../utils/edges';

export type NodeData = Omit<DiagramMessage, 'x' | 'y' | 'source_connections'>;

export interface MessageNodeProps extends RFNodeProps<RFNode<NodeData, 'message'>> {}

function MessageNode({ id, type, data: message }: MessageNodeProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.message',
  });

  const reactFlow = useReactFlow();

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditMessageOffcanvas = useMessageOffcanvasStore(
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
      retrieveAPICall: () => MessageAPI.get(telegramBotID, message.id),
      createAPICall: async ({ images, documents, ...data }) => {
        const processMedia = (media: (MessageImage | MessageDocument)[]) =>
          Promise.all(
            media.map<Promise<Data.MessagesAPI.CreateMessageMedia>>(
              async ({ name, url, from_url, position }) => ({
                file: url && name ? await fetchFile(url, name) : null,
                from_url,
                position,
              }),
            ),
          );

        const [processedImages, processedDocuments] = await Promise.all([
          processMedia(images),
          processMedia(documents),
        ]);

        return MessagesAPI.create(telegramBotID, {
          ...data,
          images: processedImages,
          documents: processedDocuments,
        });
      },
      diagramAPICall: (id) => DiagramMessageAPI.get(telegramBotID, id),
    }),
    [message.id, i18n.language],
  );

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<typeof type>, 'position'> = {
    objectType: type,
    objectID: message.id,
    nestedObjectID: 0,
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

        const response = await MessageAPI.delete(telegramBotID, message.id);

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
                    id={buildEdgeSourceHandle({
                      ...defaultEdgeHandleBuildParams,
                      position: 'left',
                      nestedObjectID: button.id,
                    })}
                    type='source'
                    position={Position.Left}
                  />
                  <Node.Handle
                    id={buildEdgeSourceHandle({
                      ...defaultEdgeHandleBuildParams,
                      position: 'right',
                      nestedObjectID: button.id,
                    })}
                    type='source'
                    position={Position.Right}
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
