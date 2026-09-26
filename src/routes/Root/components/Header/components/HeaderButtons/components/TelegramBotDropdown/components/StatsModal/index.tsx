import React, { lazy, type ReactElement, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Modal, { type ModalProps } from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import { TelegramBotsService } from 'api';
import type { RequestResult } from 'api/client/client';

const ChartBlock = lazy(() => import('./components/ChartBlock'));

export interface StatsModalProps extends Omit<ModalProps, 'children'> {}

function StatsModal(props: StatsModalProps): ReactElement {
  const { t } = useTranslation<`${RouteID.Root}`, any>('root', {
    keyPrefix: 'header.telegramBotDropdown.statsModal',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  async function getData(
    api: () => RequestResult<any[], any, false>,
    errorMessage: string,
  ): Promise<any[] | null> {
    const { data, error } = await api();

    if (error || !data) {
      createMessageToast({
        message: errorMessage,
        level: 'error',
      });
      return null;
    }

    return data;
  }

  async function getNewUsersStatsData(): Promise<any[] | null> {
    return getData(
      () =>
        TelegramBotsService.getUserTimelineStats({
          path: { telegramBotId: telegramBotID },
          query: { field: 'activated_date', days: 90 },
        }),
      t('messages.getNewUsersStats.error'),
    );
  }

  async function getUsersLastActivityStatsData(): Promise<any[] | null> {
    return getData(
      () =>
        TelegramBotsService.getUserTimelineStats({
          path: { telegramBotId: telegramBotID },
          query: { field: 'last_activity_date', days: 90 },
        }),
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
