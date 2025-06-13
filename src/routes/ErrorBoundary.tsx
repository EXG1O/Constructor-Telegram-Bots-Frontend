import React, { ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Page from 'components/shared/Page';

function ErrorBoundary(): ReactElement {
  const { t } = useTranslation('error-boundary');

  const title: string = t('title');

  return (
    <Page title={title} align='center' className='text-center text-foreground'>
      <h1 className='text-5xl font-bold'>{title}</h1>
      <p className='text-xl'>
        <Trans t={t} i18nKey='text' components={[<br key={0} />]} />
      </p>
    </Page>
  );
}

export default ErrorBoundary;
