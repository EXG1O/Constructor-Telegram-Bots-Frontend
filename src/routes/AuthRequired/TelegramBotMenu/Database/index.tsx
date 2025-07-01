import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block from 'components/ui/Block';
import Page from 'components/ui/Page';

import Footer from './components/Footer';
import RecordList from './components/RecordList';
import Toolbar from './components/Toolbar';
import StoreProvider from './providers/StoreProvider';

function Database(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase);

  return (
    <Page title={t('title')} flex gutters className='flex-auto'>
      <Block variant='light' className='flex flex-col gap-2'>
        <Block.Title>
          <h3 className='text-3xl font-semibold'>{t('records.title')}</h3>
        </Block.Title>
        <StoreProvider>
          <Toolbar />
          <RecordList />
          <Footer />
        </StoreProvider>
      </Block>
    </Page>
  );
}

export default Database;
