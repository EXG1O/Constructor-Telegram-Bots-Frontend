import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import useTelegramBot from 'components/shared/TelegramBotBlock/hooks/useTelegramBot';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import { TelegramBotAPI } from 'api/telegram_bots/telegram_bot';

import cn from 'utils/cn';

export interface TelegramBotBlockFooterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function TelegramBotBlockFooter({
  className,
  ...props
}: TelegramBotBlockFooterProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenu, {
    keyPrefix: 'telegramBotBlockFooter',
  });

  const navigate = useNavigate();

  const [telegramBot, setTelegramBot] = useTelegramBot();

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
    <div {...props} className={cn('flex', 'flex-wrap', 'gap-2')}>
      {telegramBot.is_loading ? (
        <Button variant='secondary' disabled className='flex-auto'>
          <Spinner size='xs' />
        </Button>
      ) : telegramBot.is_enabled ? (
        <>
          <Button
            variant='danger'
            className='flex-auto'
            onClick={() => handleActionClick('stop')}
          >
            {t('stopButton')}
          </Button>
          <Button
            variant='success'
            className='flex-auto'
            onClick={() => handleActionClick('restart')}
          >
            {t('restartButton')}
          </Button>
        </>
      ) : (
        <Button
          variant='success'
          className='flex-auto'
          onClick={() => handleActionClick('start')}
        >
          {t('startButton')}
        </Button>
      )}
      <Button variant='danger' className='flex-auto' onClick={handleDeleteClick}>
        {t('deleteButton')}
      </Button>
    </div>
  );
}

export default TelegramBotBlockFooter;
