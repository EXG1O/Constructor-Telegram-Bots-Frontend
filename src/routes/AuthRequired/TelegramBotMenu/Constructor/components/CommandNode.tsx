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

import { useCommandOffcanvasStore } from './CommandOffcanvas/store';
import Node from './Node';

import { CommandAPI } from 'api/telegram_bots/command';
import { DiagramCommand } from 'api/telegram_bots/command/types';
import { DiagramBlock } from 'api/telegram_bots/diagram/types';

import cn from 'utils/cn';

import {
  buildEdgeSourceHandle,
  buildEdgeTargetHandle,
  EdgeHandle,
} from '../utils/edges';

type Data = Omit<DiagramCommand, keyof DiagramBlock>;

export interface CommandNodeProps extends RFNodeProps<RFNode<Data>> {}

function CommandNode({ id, type, data: command }: CommandNodeProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.command',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const reactFlow = useReactFlow();

  const showEditCommandOffcanvas = useCommandOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const defaultEdgeHandleBuildParams: Omit<EdgeHandle<any>, 'position'> = {
    objectType: type,
    objectID: command.id,
    nestedObjectID: 0,
  };

  function handleEdit(): void {
    showEditCommandOffcanvas(command.id);
  }

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await CommandAPI.delete(telegramBot.id, command.id);

        if (response.ok) {
          reactFlow.setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
          hideConfirmModal();
          createMessageToast({
            message: t('messages.deleteCommand.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('messages.deleteCommand.error'),
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
        <Node.Title>{command.name}</Node.Title>
        <Node.Handle
          id={buildEdgeTargetHandle({
            ...defaultEdgeHandleBuildParams,
            position: 'left',
          })}
          type='target'
          position={Position.Left}
        />
        <Node.Handle
          id={buildEdgeTargetHandle({
            ...defaultEdgeHandleBuildParams,
            position: 'right',
          })}
          type='target'
          position={Position.Right}
        />
      </Node.Block>
      <Node.Block
        className={cn(
          richInputEditorInnerContentVariants({ size: 'sm' }),
          telegramRichInputEditorInnerContentVariants({ size: 'sm' }),
        )}
        dangerouslySetInnerHTML={{ __html: command.message.text }}
      />
      {command.keyboard?.buttons && (
        <div className='flex flex-col gap-1'>
          {command.keyboard.buttons.map((button) =>
            button.url ? (
              <Node.Block
                key={button.id}
                variant='dark'
                className='flex flex-wrap items-center justify-center gap-1 wrap-break-word break-word'
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

export default CommandNode;
