import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import { CardFooterProps } from 'react-bootstrap/CardFooter';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import Button from 'components/ui/Button';
import Card from 'components/ui/Card';
import Spinner from 'components/ui/Spinner';
import useTelegramBot from 'components/shared/TelegramBotBlock/hooks/useTelegramBot';
import { createMessageToast } from 'components/ui/ToastContainer';

import { TelegramBotAPI } from 'api/telegram_bots/main';

export type TelegramBotBlockFooterProps = Omit<CardFooterProps, 'as' | 'children'>;

function TelegramBotBlockFooter(
  props: TelegramBotBlockFooterProps,
): ReactElement<TelegramBotBlockFooterProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenu, {
    keyPrefix: 'telegramBotBlockFooter',
  });

  const navigate = useNavigate();

  const [telegramBot, setTelegramBot] = useTelegramBot();

  const setShowConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore(
    (state) => state.setLoading,
  );

  function showDeleteModal(): void {
    setShowConfirmModal({
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

  async function handleAction(action: 'start' | 'restart' | 'stop'): Promise<void> {
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

  return (
    <Row className='g-3'>
      <Card.Footer {...props} asChild>
        {telegramBot.is_loading ? (
          <Col>
            <Button
              disabled
              variant='secondary'
              className='w-100 d-flex justify-content-center'
            >
              <Spinner size='xs' />
            </Button>
          </Col>
        ) : telegramBot.is_enabled ? (
          <>
            <Col>
              <Button
                variant='danger'
                className='w-100'
                onClick={() => handleAction('stop')}
              >
                {t('stopButton')}
              </Button>
            </Col>
            <Col>
              <Button
                variant='success'
                className='w-100'
                onClick={() => handleAction('restart')}
              >
                {t('restartButton')}
              </Button>
            </Col>
          </>
        ) : (
          <Col>
            <Button
              variant='success'
              className='w-100'
              onClick={() => handleAction('start')}
            >
              {t('startButton')}
            </Button>
          </Col>
        )}
        <Col {...(telegramBot.is_enabled ? { xs: '12', sm: true } : {})}>
          <Button variant='danger' className='w-100' onClick={showDeleteModal}>
            {t('deleteButton')}
          </Button>
        </Col>
      </Card.Footer>
    </Row>
  );
}

export default memo(TelegramBotBlockFooter);
