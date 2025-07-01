import React, { ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';

function Completed(): ReactElement {
  const { t } = useTranslation(RouteID.DonationCompleted);

  const title: string = t('title');

  return (
    <main className='my-auto'>
      <Page asChild title={title}>
        <div className='text-center text-foreground'>
          <h2 className='mb-1 text-4xl font-semibold'>{title}!</h2>
          <p className='text-lg'>
            <Trans t={t} i18nKey='text' components={[<br key={0} />]} />
          </p>
        </div>
      </Page>
    </main>
  );
}

export default Completed;
