import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import TelegramBotContent from 'components/shared/TelegramBotContent';
import Button from 'components/ui/Button';
import Modal, { ModalProps } from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import { TelegramBotAPI } from 'api/telegram-bots/telegram-bot';
import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

import reverse from 'utils/reverse';

export interface TelegramBotModalProps extends Omit<ModalProps, 'children'> {}

function TelegramBotModal(props: TelegramBotModalProps): ReactElement {
  const { t } = useTranslation(RouteID.Root, {
    keyPrefix: 'header.telegramBotDropdown.telegramBotModal',
  });

  const navigate = useNavigate();

  const { telegramBot: originalTelegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const [telegramBot, setTelegramBot] = useState<TelegramBot>(originalTelegramBot);

  useEffect(() => setTelegramBot(originalTelegramBot), [originalTelegramBot]);

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  async function handleActionClick(
    action: 'start' | 'restart' | 'stop',
  ): Promise<void> {
    const response = await TelegramBotAPI[action](telegramBot.id);

    if (!response.ok) {
      createMessageToast({
        message: t(`messages.${action}TelegramBot.error`),
        level: 'error',
      });
    }

    setTelegramBot({ ...telegramBot, is_loading: true });
    createMessageToast({
      message: t(`messages.${action}TelegramBot.success`),
      level: 'info',
    });
  }

  function handleDeleteClick(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await TelegramBotAPI.delete(telegramBot.id);

        if (response.ok) {
          hideConfirmModal();
          navigate(reverse(RouteID.TelegramBots));
          createMessageToast({
            message: t('messages.deleteTelegramBot.success'),
            level: 'success',
          });
        } else {
          createMessageToast({
            message: t('messages.deleteTelegramBot.error'),
            level: 'error',
          });
        }

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  return (
    <Modal {...props}>
      <Modal.Content>
        <Modal.Header closeButton>
          <Modal.Title>
            <a
              href={`https://t.me/${telegramBot.username}`}
              rel='noreferrer'
              target='_blank'
            >
              {telegramBot.username}
            </a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body asChild>
          <TelegramBotContent
            telegramBot={telegramBot}
            className='-m-1'
            onChange={setTelegramBot}
          />
        </Modal.Body>
        <Modal.Footer className='flex gap-4 max-sm:flex-wrap'>
          {telegramBot.is_loading ? (
            <Button variant='secondary' disabled className='max-sm:flex-auto sm:w-full'>
              <Spinner size='xs' />
            </Button>
          ) : telegramBot.is_enabled ? (
            <>
              <Button
                variant='danger'
                className='max-sm:flex-auto sm:w-full'
                onClick={() => handleActionClick('stop')}
              >
                {t('stopButton')}
              </Button>
              <Button
                variant='success'
                className='max-sm:flex-auto sm:w-full'
                onClick={() => handleActionClick('restart')}
              >
                {t('restartButton')}
              </Button>
            </>
          ) : (
            <Button
              variant='success'
              className='max-sm:flex-auto sm:w-full'
              onClick={() => handleActionClick('start')}
            >
              {t('startButton')}
            </Button>
          )}
          <Button
            variant='danger'
            className='max-sm:flex-auto sm:w-full'
            onClick={handleDeleteClick}
          >
            {t('deleteButton')}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default TelegramBotModal;
