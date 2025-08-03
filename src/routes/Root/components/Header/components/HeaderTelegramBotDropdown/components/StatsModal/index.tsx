import React, { lazy, ReactElement, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Modal, { ModalProps } from 'components/ui/Modal';
import ModalTrigger from 'components/ui/Modal/components/ModalTrigger';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import { makeRequest } from 'api/core';
import { UsersAPI } from 'api/telegram-bots/user';

const ChartBlock = lazy(() => import('./components/ChartBlock'));

export interface StatsModalProps extends ModalProps {}

function StatsModal({ children, ...props }: StatsModalProps): ReactElement {
  const { t } = useTranslation(RouteID.Root, {
    keyPrefix: 'header.telegramBotDropdown.statsModal',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  async function getData(
    api: () => ReturnType<typeof makeRequest<any[]>>,
    errorMessage: string,
  ): Promise<any[] | null> {
    const response = await api();

    if (!response.ok) {
      createMessageToast({
        message: errorMessage,
        level: 'error',
      });
      return null;
    }

    return response.json;
  }

  async function getNewUserStatsData(): Promise<any[] | null> {
    return getData(
      () => UsersAPI.timelineStats(telegramBot.id, 'activated_date', 90),
      t('messages.getNewUserStats.error'),
    );
  }

  async function getUserActivityStatsData(): Promise<any[] | null> {
    return getData(
      () => UsersAPI.timelineStats(telegramBot.id, 'last_activity_date', 90),
      t('messages.getUserActivityStats.error'),
    );
  }

  return (
    <Modal {...props}>
      {children}
      <Modal.Content>
        <Modal.Header closeButton>
          <Modal.Title>{t('title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-3'>
          <Suspense fallback={<Spinner className='self-center' />}>
            <ChartBlock
              title={t('newUsersChart.title')}
              getData={getNewUserStatsData}
            />
            <ChartBlock
              title={t('userActivityChart.title')}
              getData={getUserActivityStatsData}
            />
          </Suspense>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

export default Object.assign(StatsModal, { Trigger: ModalTrigger });
