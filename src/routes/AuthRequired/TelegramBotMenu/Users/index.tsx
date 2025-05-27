import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block from 'components/ui/Block';
import Page from 'components/shared/Page';

import Footer from './components/Footer';
import Toolbar from './components/Toolbar';
import UsersTable from './components/UsersTable';
import StoreProvider from './providers/StoreProvider';

function Users(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuUsers);

  const title = useMemo<string>(() => t('title'), [i18n.language]);

  return (
    <Page title={title} grid>
      <StoreProvider>
        <Block variant='light'>
          <h3 className='fw-semibold text-center mb-3'>{title}</h3>
          <div className='flex flex-col gap-2'>
            <Toolbar />
            <UsersTable />
            <Footer />
          </div>
        </Block>
      </StoreProvider>
    </Page>
  );
}

export default Users;
