import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, NodeProps, Position, useStore } from 'reactflow';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ToastContainer';

import { useBackgroundTaskOffcanvasStore } from './BackgroundTaskOffcanvas/store';
import Node from './Node';

import { BackgroundTaskAPI } from 'api/telegram_bots/main';
import { DiagramBackgroundTask, DiagramBlock } from 'api/telegram_bots/types';

type Data = Omit<DiagramBackgroundTask, keyof DiagramBlock>;

export type BackgroundTaskNodeProps = NodeProps<Data>;

const nodePrefix: string = 'nodes.backgroundTask';
const offcanvasPrefix: string = 'backgroundTaskOffcanvas';

function BackgroundTaskNode({
  id,
  xPos,
  yPos,
  data: task,
}: BackgroundTaskNodeProps): ReactElement<BackgroundTaskNodeProps> {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const onNodesDelete = useStore((state) => state.onNodesDelete);

  const showEditBackgroundTaskOffcanvas = useBackgroundTaskOffcanvasStore(
    (state) => state.showOffcanvas,
  );

  const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
  const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
  const setLoadingAskConfirmModal = useAskConfirmModalStore(
    (state) => state.setLoading,
  );

  const showDeleteModal = useCallback(
    () =>
      setShowAskConfirmModal({
        title: t(`${nodePrefix}.deleteModal.title`),
        text: t(`${nodePrefix}.deleteModal.text`),
        onConfirm: async () => {
          setLoadingAskConfirmModal(true);

          const response = await BackgroundTaskAPI.delete(telegramBot.id, task.id);

          if (response.ok) {
            onNodesDelete?.([{ id, position: { x: xPos, y: yPos }, data: task }]);
            hideAskConfirmModal();
            createMessageToast({
              message: t(`${nodePrefix}.messages.deleteBackgroundTask.success`),
              level: 'success',
            });
          } else {
            createMessageToast({
              message: t(`${nodePrefix}.messages.deleteBackgroundTask.error`),
              level: 'error',
            });
          }

          setLoadingAskConfirmModal(false);
        },
        onCancel: null,
      }),
    [i18n.language],
  );

  const handleEdit = useCallback(
    () => showEditBackgroundTaskOffcanvas(task.id),
    [task.id],
  );

  return (
    <Node
      title={t(`${nodePrefix}.title`)}
      onEdit={handleEdit}
      onDelete={showDeleteModal}
    >
      <Node.Block className='position-relative text-center text-break'>
        <Handle id={`${id}:left:0`} type='source' position={Position.Left} />
        {task.name}
        <Handle id={`${id}:right:0`} type='source' position={Position.Right} />
      </Node.Block>
      <Node.Block>
        <strong>{`${t(`${nodePrefix}.interval`)}:`}</strong>{' '}
        {t(`${offcanvasPrefix}.intervalBlock.select.${task.interval}`)}
      </Node.Block>
    </Node>
  );
}

export default memo(BackgroundTaskNode);
