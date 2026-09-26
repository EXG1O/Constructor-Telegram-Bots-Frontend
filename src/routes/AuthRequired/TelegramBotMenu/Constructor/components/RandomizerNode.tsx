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

import Node from './Node';
import type { NodeHandleProps } from './Node/components/NodeHandle';
import { useRandomizerOffcanvasStore } from './RandomizerOffcanvas/store';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  ConnectionHandlePosition,
  type DiagramRandomizer,
  type Randomizer,
  TelegramBotsService,
} from 'api';

import type { NodeType } from '../enums';

export interface RandomizerNodeProps extends RFNodeProps<
  RFNode<
    Omit<DiagramRandomizer, 'x' | 'y' | 'source_connections'>,
    typeof NodeType.Randomizer
  >
> {}

function RandomizerNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: randomizer,
}: RandomizerNodeProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'nodes.randomizer' },
  );

  const reactFlow = useReactFlow();

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const showEditRandomizerOffcanvas = useRandomizerOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate<Randomizer>(
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
        TelegramBotsService.getRandomizer({
          path: { telegramBotId: botID, id: randomizer.id },
        }),
      createAPICall: (data) =>
        TelegramBotsService.createRandomizer({
          path: { telegramBotId: botID },
          body: data,
        }),
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramRandomizer({
          path: { telegramBotId: botID, id },
        }),
    }),
    [i18n.language, id, botID, randomizer.id, positionAbsoluteX, positionAbsoluteY],
  );

  const nodeHandlerProps: Pick<
    NodeHandleProps,
    'objectType' | 'objectID' | 'nestedObjectID'
  > = {
    objectType: type,
    objectID: randomizer.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const { error } = await TelegramBotsService.deleteRandomizer({
          path: { telegramBotId: botID, id: randomizer.id },
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
    showEditRandomizerOffcanvas(randomizer.id);
  }

  return (
    <Node
      title={t('title')}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    >
      <Node.Block className='relative'>
        <Node.Title>{randomizer.name}</Node.Title>
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

export default RandomizerNode;
