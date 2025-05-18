import React, { ReactElement, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Page from 'components/shared/Page';

function ErrorBoundary(): ReactElement {
  const { t, i18n } = useTranslation('error-boundary');

  const title = useMemo<string>(() => t('title'), [i18n.language]);

  return (
    <Page title={title} align='center' className='text-center'>
      <h1 className='fw-bold'>{title}</h1>
      <p className='fs-5'>
        <Trans t={t} i18nKey='text' components={[<br key={0} />]} />
      </p>
    </Page>
  );
}

export default ErrorBoundary;
