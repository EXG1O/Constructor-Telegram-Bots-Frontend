import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';

import ChatsBlock from './components/ChatsBlock';
import UsersBlock from './components/UsersBlock';

function Users(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers);

  const title: string = t('title');

  return (
    <Page title={title} flex gutters className='flex-auto'>
      <ChatsBlock />
      <UsersBlock />
    </Page>
  );
}

export default Users;
