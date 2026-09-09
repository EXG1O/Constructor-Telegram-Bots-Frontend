import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';

import { RouteID } from 'routes';

import Markdown from 'components/ui/Markdown';
import Page from 'components/ui/Page';

import useLegalRouteLoaderData from './hooks/useLegalRouteLoaderData';

function Legal(): ReactElement {
  const { t } = useTranslation(RouteID.Legal);

  const { type, document } = useLegalRouteLoaderData();

  const title: string = t('title', { context: type });

  return (
    <Page title={title} flex gutters className='flex-auto'>
      <h2 className='w-full text-center text-4xl font-semibold text-foreground'>
        {title}
      </h2>
      <div className='w-full'>
        <Markdown>{document.content}</Markdown>
      </div>
      <small className='w-full text-end text-xs text-muted'>
        {formatDate(document.updated_date)}
      </small>
    </Page>
  );
}

export default Legal;
