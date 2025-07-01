import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';

import Donations from './components/Donations';
import Header from './components/Header';
import Stats from './components/Stats';

function Home(): ReactElement {
  const { t } = useTranslation(RouteID.Home);

  const [statsRef, setStatsRef] = useState<HTMLDivElement | null>(null);

  return (
    <main className='my-auto'>
      <Page asChild title={t('title')} grid gutters>
        <div className='grid-cols-1 lg:grid-cols-2'>
          <div className='lg:col-span-2'>
            <Header />
          </div>
          <div className='lg:col-span-1'>
            <Stats ref={setStatsRef} />
          </div>
          <div className='lg:col-span-1'>
            <Donations style={{ height: statsRef?.offsetHeight }} />
          </div>
        </div>
      </Page>
    </main>
  );
}

export default Home;
