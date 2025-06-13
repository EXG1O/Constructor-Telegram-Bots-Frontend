import React, { ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/shared/Page';

function Completed(): ReactElement {
  const { t } = useTranslation(RouteID.DonationCompleted);

  const title: string = t('title');

  return (
    <Page title={title} align='center' className='text-center text-foreground'>
      <h2 className='text-4xl font-semibold'>{title}</h2>
      <p className='text-lg'>
        <Trans t={t} i18nKey='text' components={[<br key={0} />]} />
      </p>
    </Page>
  );
}

export default Completed;
