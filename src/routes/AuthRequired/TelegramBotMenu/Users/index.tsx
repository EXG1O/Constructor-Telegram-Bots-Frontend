import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block from 'components/ui/Block';
import Page from 'components/ui/Page';

import Footer from './components/Footer';
import Toolbar from './components/Toolbar';
import UsersTable from './components/UsersTable';
import StoreProvider from './providers/StoreProvider';

function Users(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers);

  const title: string = t('title');

  return (
    <Page title={title} flex gutters className='flex-auto'>
      <StoreProvider>
        <Block variant='light' className='flex flex-col gap-2'>
          <h3 className='w-full text-center text-3xl font-semibold'>{title}</h3>
          <Toolbar />
          <UsersTable />
          <Footer />
        </Block>
      </StoreProvider>
    </Page>
  );
}

export default Users;
