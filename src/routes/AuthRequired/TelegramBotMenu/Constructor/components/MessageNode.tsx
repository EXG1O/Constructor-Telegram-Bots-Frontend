import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Node as RFNode,
  NodeProps as RFNodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { Link } from 'lucide-react';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import { telegramRichInputEditorInnerContentVariants } from 'components/shared/TelegramRichInputLayout';
import { richInputEditorInnerContentVariants } from 'components/ui/RichInput/components/RichInputEditor';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useMessageOffcanvasStore } from './MessageOffcanvas/store';
import Node from './Node';

import { DiagramBlock } from 'api/telegram-bots/diagram/types';
import { MessageAPI } from 'api/telegram-bots/message';
import { DiagramMessage } from 'api/telegram-bots/message/types';

import cn from 'utils/cn';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  EdgeHandle,
} from '../utils/edges';

type Data = Omit<DiagramMessage, keyof DiagramBlock>;

export interface MessageNodeProps extends RFNodeProps<RFNode<Data>> {}

function MessageNode({ id, type, data: message }: MessageNodeProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.message',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const reactFlow = useReactFlow();

  const showEditMessageOffcanvas = useMessageOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<any>, 'position'> = {
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

        const response = await MessageAPI.delete(telegramBot.id, message.id);

        if (response.ok) {
          reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
          hideConfirmModal();
          createMessageToast({
            message: t('messages.deleteMessage.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('messages.deleteMessage.error'),
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
      <Node.Block
        className={cn(
          richInputEditorInnerContentVariants({ size: 'sm' }),
          telegramRichInputEditorInnerContentVariants({ size: 'sm' }),
        )}
        dangerouslySetInnerHTML={{ __html: message.text }}
      />
      {message.keyboard?.buttons && (
        <div className='flex flex-col gap-1'>
          {message.keyboard.buttons.map((button) =>
            button.url ? (
              <Node.Block
                key={button.id}
                variant='dark'
                className='flex flex-wrap items-center justify-center gap-1 wrap-anywhere'
              >
                {button.text}
                <Link className='size-3' />
              </Node.Block>
            ) : (
              <Node.Block
                key={button.id}
                variant='dark'
                className='relative text-center'
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
