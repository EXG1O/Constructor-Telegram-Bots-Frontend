import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';

import SystemVariables from './components/SystemVariables';
import UserVariables from './components/UserVariables';

function Variables(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables);

  return (
    <Page title={t('title')} flex gutters className='flex-auto'>
      <SystemVariables />
      <UserVariables.StoreProvider>
        <UserVariables />
      </UserVariables.StoreProvider>
    </Page>
  );
}

export default Variables;
