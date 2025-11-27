import React, { lazy, ReactElement, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Modal, { ModalProps } from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import { makeRequest } from 'api/core';
import { UsersAPI } from 'api/telegram-bots/user';

const ChartBlock = lazy(() => import('./components/ChartBlock'));

export interface StatsModalProps extends Omit<ModalProps, 'children'> {}

function StatsModal(props: StatsModalProps): ReactElement {
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

  async function getNewUsersStatsData(): Promise<any[] | null> {
    return getData(
      () => UsersAPI.timelineStats(telegramBot.id, 'activated_date', 90),
      t('messages.getNewUsersStats.error'),
    );
  }

  async function getUsersLastActivityStatsData(): Promise<any[] | null> {
    return getData(
      () => UsersAPI.timelineStats(telegramBot.id, 'last_activity_date', 90),
      t('messages.getUsersLastActivityStats.error'),
    );
  }

  return (
    <Modal {...props}>
      <Modal.Content>
        <Modal.Header closeButton>
          <Modal.Title>{t('title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-3'>
          <Suspense fallback={<Spinner className='self-center' />}>
            <ChartBlock
              title={t('newUsersChart.title')}
              getData={getNewUsersStatsData}
            />
            <ChartBlock
              title={t('usersLastActivityChart.title')}
              getData={getUsersLastActivityStatsData}
            />
          </Suspense>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

export default StatsModal;
