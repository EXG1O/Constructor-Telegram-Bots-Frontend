import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block from 'components/ui/Block';
import Page from 'components/Page';
import Stack from 'components/Stack';

import Footer from './components/Footer';
import RecordList from './components/RecordList';
import Toolbar from './components/Toolbar';
import StoreProvider from './providers/StoreProvider';

function Database(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase);

  return (
    <Page title={t('title')} grid>
      <StoreProvider>
        <Block variant='light'>
          <h3 className='fw-semibold text-center mb-3'>{t('records.title')}</h3>
          <Stack gap={2}>
            <Toolbar />
            <RecordList />
            <Footer />
          </Stack>
        </Block>
      </StoreProvider>
    </Page>
  );
}

export default Database;
