import React, { ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Page from 'components/ui/Page';

function ErrorBoundary(): ReactElement {
  const { t } = useTranslation('error-boundary');

  const title: string = t('title');

  return (
    <main className='my-auto'>
      <Page asChild title={title}>
        <div className='text-center text-foreground'>
          <h1 className='mb-1 text-5xl font-bold'>{title}</h1>
          <p className='text-xl'>
            <Trans t={t} i18nKey='text' components={[<br key={0} />]} />
          </p>
        </div>
      </Page>
    </main>
  );
}

export default ErrorBoundary;
