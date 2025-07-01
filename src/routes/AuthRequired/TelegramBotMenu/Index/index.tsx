import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import TelegramBotBlock from 'components/shared/TelegramBotBlock';
import Page from 'components/ui/Page';

import TelegramBotBlockFooter from './components/TelegramBotBlockFooter';

function Index(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenu);

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  return (
    <Page
      title={t('title')}
      grid
      gutters
      className='flex-auto grid-cols-1 lg:grid-cols-2'
    >
      <div>
        <TelegramBotBlock telegramBot={telegramBot}>
          <TelegramBotBlockFooter />
        </TelegramBotBlock>
      </div>
    </Page>
  );
}

export default Index;
