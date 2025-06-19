import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';

import Donations from './components/Donations';
import Header from './components/Header';
import Stats from './components/Stats';

function Home(): ReactElement {
  const { t } = useTranslation(RouteID.Home);

  return (
    <main className='my-auto'>
      <Page asChild title={t('title')} grid gutters>
        <div className='grid-cols-1 lg:grid-cols-2'>
          <div className='lg:col-span-2'>
            <Header />
          </div>
          <div className='lg:col-span-1'>
            <Stats className='h-[324px]' />
          </div>
          <div className='lg:col-span-1'>
            <Donations className='h-[324px]' />
          </div>
        </div>
      </Page>
    </main>
  );
}

export default Home;
