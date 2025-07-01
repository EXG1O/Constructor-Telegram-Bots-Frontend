import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';

import Header from './components/Header';
import TelegramBotList from './components/TelegramBotList';
import TelegramBotsContext from './contexts/TelegramBotsContext';

import useTelegramBotsRouteLoaderData from './hooks/useTelegramBotsRouteLoaderData';

import { TelegramBot } from 'api/telegram_bots/types';

function TelegramBots(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBots);

  const { telegramBots: defaultTelegramBots } = useTelegramBotsRouteLoaderData();

  const telegramBotsState = useState<TelegramBot[]>(defaultTelegramBots);

  return (
    <Page title={t('title')} flex gutters className='flex-auto'>
      <TelegramBotsContext.Provider value={telegramBotsState}>
        <Header />
        <TelegramBotList />
      </TelegramBotsContext.Provider>
    </Page>
  );
}

export default TelegramBots;
