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
import Table from 'components/ui/Table';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useBackgroundTaskOffcanvasStore } from './BackgroundTaskOffcanvas/store';
import Node from './Node';
import type { NodeHandleProps } from './Node/components/NodeHandle';

import useNodeDuplicate from './Node/hooks/useNodeDuplicate';

import {
  type BackgroundTask,
  type BackgroundTaskStatus,
  ConnectionHandlePosition,
  type DiagramBackgroundTask,
  TelegramBotsService,
} from 'api';

import type { NodeType } from '../enums';

export interface BackgroundTaskNodeProps extends RFNodeProps<
  RFNode<
    Omit<DiagramBackgroundTask, 'x' | 'y' | 'source_connections'>,
    typeof NodeType.BackgroundTask
  >
> {}

function BackgroundTaskNode({
  id,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data: task,
}: BackgroundTaskNodeProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'nodes.backgroundTask' },
  );

  const reactFlow = useReactFlow();

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);
  const botIsEnabled = useTelegramBotStore((state) => state.telegramBot!.is_enabled);

  const showEditBackgroundTaskOffcanvas = useBackgroundTaskOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  const handleDuplicate = useNodeDuplicate<BackgroundTask>(
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
        TelegramBotsService.getBackgroundTask({
          path: { telegramBotId: botID, id: task.id },
        }),
      createAPICall: (data) =>
        TelegramBotsService.createBackgroundTask({
          path: { telegramBotId: botID },
          body: data,
        }),
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramBackgroundTask({
          path: { telegramBotId: botID, id },
        }),
    }),
    [task.id, id, positionAbsoluteX, positionAbsoluteY, i18n.language],
  );

  const nodeHandlerProps: Pick<
    NodeHandleProps,
    'objectType' | 'objectID' | 'nestedObjectID'
  > = {
    objectType: type,
    objectID: task.id,
    nestedObjectID: 0,
  };

  function handleDelete(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const { error } = await TelegramBotsService.deleteBackgroundTask({
          path: { telegramBotId: botID, id: task.id },
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
    showEditBackgroundTaskOffcanvas(task.id);
  }

  return (
    <Node
      title={t('title')}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    >
      <Node.Block className='relative'>
        <Node.Title>{task.name}</Node.Title>
        <Node.Handle
          {...nodeHandlerProps}
          type='source'
          position={ConnectionHandlePosition.Left}
        />
        <Node.Handle
          {...nodeHandlerProps}
          type='source'
          position={ConnectionHandlePosition.Right}
        />
      </Node.Block>
      <Node.Block>
        <div className='-m-0.5 w-full'>
          <Table size='xs'>
            <Table.Body>
              <Table.Row>
                <Table.Head scope='row'>{t('table.status.header')}:</Table.Head>
                <Table.Cell>
                  {t(
                    `table.status.${botIsEnabled ? (task.status as BackgroundTaskStatus) : 'inactive'}`,
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Head scope='row'>{t('table.interval.header')}:</Table.Head>
                <Table.Cell>
                  {t('table.interval.value', { value: task.interval })}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </Node.Block>
    </Node>
  );
}

export default BackgroundTaskNode;
