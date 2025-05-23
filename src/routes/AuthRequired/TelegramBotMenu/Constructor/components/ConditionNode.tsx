import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, NodeProps as RFNodeProps, Position, useStore } from 'reactflow';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useConditionOffcanvasStore } from './ConditionOffcanvas/store';
import Node, { NodeProps } from './Node';

import { ConditionAPI } from 'api/telegram_bots/main';
import { DiagramBlock, DiagramCondition } from 'api/telegram_bots/types';

type Data = Omit<DiagramCondition, keyof DiagramBlock>;

export type ConditionNodeProps = RFNodeProps<Data>;

type EditHandler = NodeProps['onEdit'];

function ConditionNode({
  id,
  xPos,
  yPos,
  data: condition,
}: ConditionNodeProps): ReactElement<ConditionNodeProps> {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nodes.condition',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const onNodesDelete = useStore((state) => state.onNodesDelete);

  const showEditConditionOffcanvas = useConditionOffcanvasStore(
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
        title: t('deleteModal.title'),
        text: t('deleteModal.text'),
        onConfirm: async () => {
          setLoadingAskConfirmModal(true);

          const response = await ConditionAPI.delete(telegramBot.id, condition.id);

          if (response.ok) {
            onNodesDelete?.([{ id, position: { x: xPos, y: yPos }, data: condition }]);
            hideAskConfirmModal();
            createMessageToast({
              message: t('messages.deleteCondition.success'),
              level: 'success',
            });
          } else {
            createMessageToast({
              message: t('messages.deleteCondition.error'),
              level: 'error',
            });
          }

          setLoadingAskConfirmModal(false);
        },
        onCancel: null,
      }),
    [i18n.language],
  );

  const handleEdit = useCallback<EditHandler>(
    () => showEditConditionOffcanvas(condition.id),
    [condition.id],
  );

  return (
    <Node title={t('title')} onEdit={handleEdit} onDelete={showDeleteModal}>
      <Node.Block className='position-relative text-center text-break'>
        <Handle id={`${id}:left:0`} type='target' position={Position.Left} />
        {condition.name}
        <Handle id={`${id}:right:0`} type='source' position={Position.Right} />
      </Node.Block>
    </Node>
  );
}

export default memo(ConditionNode);
